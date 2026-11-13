"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify, uniqueSlug } from "@/lib/slug";
import { deleteImage, uploadImage } from "@/lib/blob";
import { ADMIN_BASE_PATH } from "@/lib/auth";

const CATEGORIES_PATH = `${ADMIN_BASE_PATH}/categories`;

export type CategoryFormState = { error?: string };

const schema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  description: z.string().optional(),
  position: z.coerce.number().int().default(0),
  parentId: z.string().optional(),
});

function parseCategoryForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    position: formData.get("position"),
    parentId: formData.get("parentId") || undefined,
  });
}

async function resolveParent(parentId: string | undefined) {
  if (!parentId) return null;
  const parent = await prisma.category.findUnique({ where: { id: parentId } });
  if (!parent) {
    throw new Error("Catégorie parente introuvable.");
  }
  if (parent.parentId !== null) {
    throw new Error("Impossible d'imbriquer une sous-catégorie sous une autre sous-catégorie.");
  }
  return parent.id;
}

function getBannerFile(formData: FormData): File | null {
  const file = formData.get("banner");
  return file instanceof File && file.size > 0 ? file : null;
}

async function uploadNewRealisationImages(formData: FormData): Promise<string[]> {
  const files = formData.getAll("realisationImages").filter((f): f is File => f instanceof File && f.size > 0);
  return Promise.all(files.map((file) => uploadImage(file, "categories-realisations")));
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseCategoryForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  try {
    const parentId = await resolveParent(parsed.data.parentId);
    const slug = await uniqueSlug(parsed.data.name, async (s) => {
      const existing = await prisma.category.findUnique({ where: { slug: s } });
      return Boolean(existing);
    });

    const bannerFile = getBannerFile(formData);
    const bannerUrl = bannerFile ? await uploadImage(bannerFile, "categories") : null;
    const realisationImageUrls = await uploadNewRealisationImages(formData);

    await prisma.category.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        slug,
        position: parsed.data.position,
        parentId,
        bannerUrl,
        realisationImages: {
          create: realisationImageUrls.map((url, i) => ({ url, position: i })),
        },
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inattendue." };
  }

  revalidatePath(CATEGORIES_PATH);
  revalidatePath("/catalogue");
  revalidatePath("/");
  redirect(CATEGORIES_PATH);
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const parsed = parseCategoryForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  try {
    const current = await prisma.category.findUnique({ where: { id }, include: { realisationImages: true } });
    if (!current) {
      return { error: "Catégorie introuvable." };
    }

    if (parsed.data.parentId === id) {
      return { error: "Une catégorie ne peut pas être sa propre catégorie parente." };
    }

    const parentId = await resolveParent(parsed.data.parentId);

    if (current.parentId === null) {
      const hasChildren = await prisma.category.count({ where: { parentId: id } });
      if (hasChildren > 0 && parentId !== null) {
        return { error: "Cette catégorie a des sous-catégories, elle ne peut pas devenir une sous-catégorie." };
      }
    }

    const slug = await uniqueSlug(
      parsed.data.name,
      async (s) => {
        const existing = await prisma.category.findUnique({ where: { slug: s } });
        return Boolean(existing && existing.id !== id);
      },
      current.slug === slugify(parsed.data.name) ? current.slug : undefined,
    );

    const bannerFile = getBannerFile(formData);
    const removeBanner = formData.get("removeBanner") === "on";
    let bannerUrl = current.bannerUrl;

    if (bannerFile) {
      bannerUrl = await uploadImage(bannerFile, "categories");
      if (current.bannerUrl) {
        await deleteImage(current.bannerUrl);
      }
    } else if (removeBanner && current.bannerUrl) {
      await deleteImage(current.bannerUrl);
      bannerUrl = null;
    }

    const suggestedProductIds = formData.getAll("suggestedProductIds").map(String);

    const removeRealisationImageIds = new Set(formData.getAll("removeRealisationImageIds").map(String));
    const realisationImagesToRemove = current.realisationImages.filter((img) =>
      removeRealisationImageIds.has(img.id),
    );
    const newRealisationImageUrls = await uploadNewRealisationImages(formData);
    const keptRealisationCount = current.realisationImages.length - realisationImagesToRemove.length;

    await prisma.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        slug,
        position: parsed.data.position,
        parentId,
        bannerUrl,
        suggestedProducts: { set: suggestedProductIds.map((pid) => ({ id: pid })) },
        realisationImages: {
          deleteMany: { id: { in: [...removeRealisationImageIds] } },
          create: newRealisationImageUrls.map((url, i) => ({ url, position: keptRealisationCount + i })),
        },
      },
    });

    await Promise.all(realisationImagesToRemove.map((img) => deleteImage(img.url)));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inattendue." };
  }

  revalidatePath(CATEGORIES_PATH);
  revalidatePath("/catalogue");
  revalidatePath("/");
  redirect(CATEGORIES_PATH);
}

export async function moveCategory(id: string, direction: "up" | "down") {
  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return;

  const siblings = await prisma.category.findMany({
    where: { parentId: current.parentId },
    orderBy: { position: "asc" },
  });

  const index = siblings.findIndex((c) => c.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) return;

  const other = siblings[swapIndex];
  await prisma.$transaction([
    prisma.category.update({ where: { id: current.id }, data: { position: other.position } }),
    prisma.category.update({ where: { id: other.id }, data: { position: current.position } }),
  ]);

  revalidatePath(CATEGORIES_PATH);
  revalidatePath("/catalogue");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  const childCount = await prisma.category.count({ where: { parentId: id } });
  const productCount = await prisma.product.count({ where: { categories: { some: { id } } } });

  if (childCount > 0 || productCount > 0) {
    throw new Error("Supprimez d'abord les sous-catégories et produits rattachés.");
  }

  const category = await prisma.category.findUnique({ where: { id }, include: { realisationImages: true } });
  await prisma.category.delete({ where: { id } });
  if (category?.bannerUrl) {
    await deleteImage(category.bannerUrl);
  }
  if (category) {
    await Promise.all(category.realisationImages.map((img) => deleteImage(img.url)));
  }

  revalidatePath(CATEGORIES_PATH);
  revalidatePath("/catalogue");
  revalidatePath("/");
}

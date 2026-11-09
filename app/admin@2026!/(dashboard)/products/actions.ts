"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { deleteImage, uploadImage } from "@/lib/blob";
import { ADMIN_BASE_PATH } from "@/lib/auth";
import { UNIT_OPTIONS, STATUS_OPTIONS } from "@/lib/priceUnits";

const PRODUCTS_PATH = `${ADMIN_BASE_PATH}/products`;

export type ProductFormState = { error?: string };

const schema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  priceUnit: z.enum(UNIT_OPTIONS).optional().or(z.literal("")),
  priceStatus: z.enum(STATUS_OPTIONS).optional().or(z.literal("")),
  categoryIds: z.array(z.string()).min(1, "Choisissez au moins une catégorie."),
  position: z.coerce.number().int().default(0),
});

function parseProductForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    priceUnit: formData.get("priceUnit") || undefined,
    priceStatus: formData.get("priceStatus") || undefined,
    categoryIds: formData.getAll("categoryIds"),
    position: formData.get("position"),
  });
}

type DimensionInput = { dimension: string; price: number | null; description: string | null };

function parseDimensions(formData: FormData): { data: DimensionInput[] } | { error: string } {
  const dimensionValues = formData.getAll("dimension").map((v) => String(v).trim());
  const priceValues = formData.getAll("dimensionPrice").map((v) => String(v).trim());
  const descriptionValues = formData.getAll("dimensionDescription").map((v) => String(v).trim());
  const data: DimensionInput[] = [];

  for (let i = 0; i < dimensionValues.length; i++) {
    const dimension = dimensionValues[i];
    const priceRaw = priceValues[i] ?? "";
    const description = descriptionValues[i] || "";
    if (!dimension && !priceRaw && !description) continue;

    let price: number | null = null;
    if (priceRaw) {
      price = Number.parseFloat(priceRaw);
      if (Number.isNaN(price) || price < 0) {
        return { error: `Prix invalide pour la dimension "${dimension || "(sans nom)"}".` };
      }
    }
    data.push({ dimension, price, description: description || null });
  }

  return { data };
}

async function uploadNewImages(formData: FormData): Promise<string[]> {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  return Promise.all(files.map((file) => uploadImage(file, "products")));
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const dimensionsResult = parseDimensions(formData);
  if ("error" in dimensionsResult) {
    return { error: dimensionsResult.error };
  }

  try {
    const categories = await prisma.category.findMany({ where: { id: { in: parsed.data.categoryIds } } });
    if (categories.length !== parsed.data.categoryIds.length) {
      return { error: "Une des catégories sélectionnées est introuvable." };
    }

    const slug = await uniqueSlug(parsed.data.name, async (s) => {
      const existing = await prisma.product.findUnique({ where: { slug: s } });
      return Boolean(existing);
    });

    const imageUrls = await uploadNewImages(formData);

    await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug,
        priceUnit: parsed.data.priceUnit || null,
        priceStatus: parsed.data.priceStatus || null,
        position: parsed.data.position,
        categories: { connect: parsed.data.categoryIds.map((id) => ({ id })) },
        images: { create: imageUrls.map((url, i) => ({ url, position: i })) },
        dimensions: { create: dimensionsResult.data.map((d, i) => ({ ...d, position: i })) },
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inattendue." };
  }

  revalidatePath(PRODUCTS_PATH);
  revalidatePath("/catalogue");
  redirect(PRODUCTS_PATH);
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const dimensionsResult = parseDimensions(formData);
  if ("error" in dimensionsResult) {
    return { error: dimensionsResult.error };
  }

  try {
    const current = await prisma.product.findUnique({ where: { id }, include: { images: true } });
    if (!current) {
      return { error: "Produit introuvable." };
    }

    const categories = await prisma.category.findMany({ where: { id: { in: parsed.data.categoryIds } } });
    if (categories.length !== parsed.data.categoryIds.length) {
      return { error: "Une des catégories sélectionnées est introuvable." };
    }

    const slug = await uniqueSlug(
      parsed.data.name,
      async (s) => {
        const existing = await prisma.product.findUnique({ where: { slug: s } });
        return Boolean(existing && existing.id !== id);
      },
      current.slug,
    );

    const removeImageIds = new Set(formData.getAll("removeImageIds").map(String));
    const imagesToRemove = current.images.filter((img) => removeImageIds.has(img.id));
    const newImageUrls = await uploadNewImages(formData);
    const keptCount = current.images.length - imagesToRemove.length;

    await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug,
        priceUnit: parsed.data.priceUnit || null,
        priceStatus: parsed.data.priceStatus || null,
        position: parsed.data.position,
        categories: { set: parsed.data.categoryIds.map((cid) => ({ id: cid })) },
        images: {
          deleteMany: { id: { in: [...removeImageIds] } },
          create: newImageUrls.map((url, i) => ({ url, position: keptCount + i })),
        },
        dimensions: {
          deleteMany: {},
          create: dimensionsResult.data.map((d, i) => ({ ...d, position: i })),
        },
      },
    });

    await Promise.all(imagesToRemove.map((img) => deleteImage(img.url)));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inattendue." };
  }

  revalidatePath(PRODUCTS_PATH);
  revalidatePath("/catalogue");
  redirect(PRODUCTS_PATH);
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
  if (!product) return;

  await prisma.product.delete({ where: { id } });
  await Promise.all(product.images.map((img) => deleteImage(img.url)));

  revalidatePath(PRODUCTS_PATH);
  revalidatePath("/catalogue");
}

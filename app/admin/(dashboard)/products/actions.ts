"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { deleteProductImage, uploadProductImage } from "@/lib/blob";

export type ProductFormState = { error?: string };

const schema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  description: z.string().optional(),
  categoryId: z.string().min(1, "La catégorie est requise."),
  position: z.coerce.number().int().default(0),
});

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    categoryId: formData.get("categoryId"),
    position: formData.get("position"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  try {
    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      return { error: "Catégorie introuvable." };
    }

    const slug = await uniqueSlug(parsed.data.name, async (s) => {
      const existing = await prisma.product.findUnique({ where: { slug: s } });
      return Boolean(existing);
    });

    const image = formData.get("image");
    const imageUrl = image instanceof File && image.size > 0 ? await uploadProductImage(image) : null;

    await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        categoryId: parsed.data.categoryId,
        position: parsed.data.position,
        imageUrl,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inattendue." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/catalogue");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    categoryId: formData.get("categoryId"),
    position: formData.get("position"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  try {
    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) {
      return { error: "Produit introuvable." };
    }

    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      return { error: "Catégorie introuvable." };
    }

    const slug = await uniqueSlug(
      parsed.data.name,
      async (s) => {
        const existing = await prisma.product.findUnique({ where: { slug: s } });
        return Boolean(existing && existing.id !== id);
      },
      current.slug,
    );

    const image = formData.get("image");
    let imageUrl = current.imageUrl;
    if (image instanceof File && image.size > 0) {
      imageUrl = await uploadProductImage(image);
      if (current.imageUrl) {
        await deleteProductImage(current.imageUrl);
      }
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description ?? null,
        categoryId: parsed.data.categoryId,
        position: parsed.data.position,
        imageUrl,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inattendue." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/catalogue");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.delete({ where: { id } });
  if (product.imageUrl) {
    await deleteProductImage(product.imageUrl);
  }

  revalidatePath("/admin/products");
  revalidatePath("/catalogue");
}

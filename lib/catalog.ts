import { prisma } from "@/lib/prisma";

const productInclude = {
  images: { orderBy: { position: "asc" as const } },
  dimensions: { orderBy: { position: "asc" as const } },
};

export function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { position: "asc" },
    include: {
      children: { orderBy: { position: "asc" } },
      products: { orderBy: { position: "asc" }, include: productInclude },
    },
  });
}

export function getNavCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      children: {
        orderBy: { position: "asc" },
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: { orderBy: { position: "asc" } },
      products: { orderBy: { position: "asc" }, include: productInclude },
      suggestedProducts: { orderBy: { position: "asc" }, include: productInclude },
    },
  });
}

export function getProductsForCategory(categoryId: string) {
  return prisma.product.findMany({
    where: { categories: { some: { id: categoryId } } },
    orderBy: { position: "asc" },
    include: productInclude,
  });
}

export function getAllProductOptions() {
  return prisma.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getFlatCategoryOptions(): Promise<{ id: string; label: string }[]> {
  const roots = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { position: "asc" },
    include: { children: { orderBy: { position: "asc" } } },
  });

  return roots.flatMap((root) => [
    { id: root.id, label: root.name },
    ...root.children.map((child) => ({ id: child.id, label: `${root.name} > ${child.name}` })),
  ]);
}

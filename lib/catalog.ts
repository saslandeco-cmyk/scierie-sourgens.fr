import { prisma } from "@/lib/prisma";

export function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null },
    orderBy: { position: "asc" },
    include: {
      children: { orderBy: { position: "asc" } },
      products: { orderBy: { position: "asc" } },
    },
  });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: { orderBy: { position: "asc" } },
      products: { orderBy: { position: "asc" } },
    },
  });
}

export function getProductsForCategory(categoryId: string) {
  return prisma.product.findMany({
    where: { categoryId },
    orderBy: { position: "asc" },
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

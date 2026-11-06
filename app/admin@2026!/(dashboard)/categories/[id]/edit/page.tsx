import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAllProductOptions } from "@/lib/catalog";
import { updateCategory } from "../../actions";
import CategoryForm from "../../CategoryForm";
import s from "../../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { suggestedProducts: { select: { id: true } } },
  });
  if (!category) {
    notFound();
  }

  const rootCategories = await prisma.category.findMany({
    where: { parentId: null, NOT: { id } },
    orderBy: { position: "asc" },
    select: { id: true, name: true },
  });

  const isSubcategory = category.parentId !== null;
  const allProducts = isSubcategory ? await getAllProductOptions() : undefined;

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Modifier « {category.name} »</h1>
      </div>
      <CategoryForm
        action={updateCategory.bind(null, id)}
        rootCategories={rootCategories}
        allProducts={allProducts}
        defaults={{
          name: category.name,
          description: category.description ?? "",
          position: category.position,
          parentId: category.parentId,
          bannerUrl: category.bannerUrl,
          suggestedProductIds: category.suggestedProducts.map((p) => p.id),
        }}
        submitLabel="Enregistrer"
      />
    </div>
  );
}

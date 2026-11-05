import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCategory } from "../../actions";
import CategoryForm from "../../CategoryForm";
import s from "../../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    notFound();
  }

  const rootCategories = await prisma.category.findMany({
    where: { parentId: null, NOT: { id } },
    orderBy: { position: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Modifier « {category.name} »</h1>
      </div>
      <CategoryForm
        action={updateCategory.bind(null, id)}
        rootCategories={rootCategories}
        defaults={{ name: category.name, position: category.position, parentId: category.parentId }}
        submitLabel="Enregistrer"
      />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { createCategory } from "../actions";
import CategoryForm from "../CategoryForm";
import s from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ parentId?: string }>;
}) {
  const { parentId } = await searchParams;
  const rootCategories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { position: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Nouvelle catégorie</h1>
      </div>
      <CategoryForm
        action={createCategory}
        rootCategories={rootCategories}
        defaults={{ parentId }}
        submitLabel="Créer"
      />
    </div>
  );
}

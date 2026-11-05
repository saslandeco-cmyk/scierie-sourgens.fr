import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "./actions";
import s from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { position: "asc" },
    include: {
      children: { orderBy: { position: "asc" }, include: { products: true } },
      products: true,
    },
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Catégories</h1>
        <Link href="/admin/categories/new" className={s.button}>
          Nouvelle catégorie
        </Link>
      </div>

      {categories.length === 0 && <p className={s.empty}>Aucune catégorie pour le moment.</p>}

      <ul className={s.tree}>
        {categories.map((category) => (
          <li key={category.id}>
            <div className={s.treeItem}>
              <span>
                {category.name} ({category.products.length} produit(s))
              </span>
              <span className={s.treeActions}>
                <Link href={`/admin/categories/new?parentId=${category.id}`} className={`${s.button} ${s.buttonSecondary}`}>
                  + Sous-catégorie
                </Link>
                <Link href={`/admin/categories/${category.id}/edit`} className={`${s.button} ${s.buttonSecondary}`}>
                  Modifier
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteCategory(category.id);
                  }}
                >
                  <button type="submit" className={`${s.button} ${s.buttonDanger}`}>
                    Supprimer
                  </button>
                </form>
              </span>
            </div>

            {category.children.length > 0 && (
              <ul className={s.treeChildren}>
                {category.children.map((sub) => (
                  <li key={sub.id} className={s.treeItem}>
                    <span>
                      {sub.name} ({sub.products.length} produit(s))
                    </span>
                    <span className={s.treeActions}>
                      <Link href={`/admin/categories/${sub.id}/edit`} className={`${s.button} ${s.buttonSecondary}`}>
                        Modifier
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteCategory(sub.id);
                        }}
                      >
                        <button type="submit" className={`${s.button} ${s.buttonDanger}`}>
                          Supprimer
                        </button>
                      </form>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

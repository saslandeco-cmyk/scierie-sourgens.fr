import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategory, moveCategory } from "./actions";
import { ADMIN_BASE_PATH } from "@/lib/auth";
import ConfirmButton from "../ConfirmButton";
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
        <Link href={`${ADMIN_BASE_PATH}/categories/new`} className={s.button}>
          Nouvelle catégorie
        </Link>
      </div>

      <p className={s.empty}>
        Utilisez les flèches ▲▼ pour changer l'ordre d'affichage dans le menu déroulant du site.
      </p>

      {categories.length === 0 && <p className={s.empty}>Aucune catégorie pour le moment.</p>}

      <ul className={s.tree}>
        {categories.map((category, i) => (
          <li key={category.id}>
            <div className={s.treeItem}>
              <span className={s.reorderGroup}>
                <form
                  action={async () => {
                    "use server";
                    await moveCategory(category.id, "up");
                  }}
                >
                  <button type="submit" className={s.reorderButton} disabled={i === 0} aria-label="Monter">
                    ▲
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await moveCategory(category.id, "down");
                  }}
                >
                  <button
                    type="submit"
                    className={s.reorderButton}
                    disabled={i === categories.length - 1}
                    aria-label="Descendre"
                  >
                    ▼
                  </button>
                </form>
                {category.name} ({category.products.length} produit(s))
              </span>
              <span className={s.treeActions}>
                <Link href={`${ADMIN_BASE_PATH}/categories/new?parentId=${category.id}`} className={`${s.button} ${s.buttonSecondary}`}>
                  + Sous-catégorie
                </Link>
                <Link href={`${ADMIN_BASE_PATH}/categories/${category.id}/edit`} className={`${s.button} ${s.buttonSecondary}`}>
                  Modifier
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteCategory(category.id);
                  }}
                >
                  <ConfirmButton
                    className={`${s.button} ${s.buttonDanger}`}
                    confirmText={`Supprimer définitivement la catégorie « ${category.name} » ? Cette action est irréversible.`}
                  >
                    Supprimer
                  </ConfirmButton>
                </form>
              </span>
            </div>

            {category.children.length > 0 && (
              <details className={s.accordion}>
                <summary>
                  Sous-catégories ({category.children.length})
                </summary>
                <ul className={s.treeChildren}>
                  {category.children.map((sub, j) => (
                    <li key={sub.id} className={s.treeItem}>
                      <span className={s.reorderGroup}>
                        <form
                          action={async () => {
                            "use server";
                            await moveCategory(sub.id, "up");
                          }}
                        >
                          <button type="submit" className={s.reorderButton} disabled={j === 0} aria-label="Monter">
                            ▲
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await moveCategory(sub.id, "down");
                          }}
                        >
                          <button
                            type="submit"
                            className={s.reorderButton}
                            disabled={j === category.children.length - 1}
                            aria-label="Descendre"
                          >
                            ▼
                          </button>
                        </form>
                        {sub.name} ({sub.products.length} produit(s))
                      </span>
                      <span className={s.treeActions}>
                        <Link href={`${ADMIN_BASE_PATH}/categories/${sub.id}/edit`} className={`${s.button} ${s.buttonSecondary}`}>
                          Modifier
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteCategory(sub.id);
                          }}
                        >
                          <ConfirmButton
                            className={`${s.button} ${s.buttonDanger}`}
                            confirmText={`Supprimer définitivement la sous-catégorie « ${sub.name} » ? Cette action est irréversible.`}
                          >
                            Supprimer
                          </ConfirmButton>
                        </form>
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

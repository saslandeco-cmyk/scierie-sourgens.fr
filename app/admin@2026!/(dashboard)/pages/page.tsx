import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePage } from "./actions";
import { ADMIN_BASE_PATH } from "@/lib/auth";
import ConfirmButton from "../ConfirmButton";
import s from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Pages</h1>
        <Link href={`${ADMIN_BASE_PATH}/pages/new`} className={s.button}>
          Nouvelle page
        </Link>
      </div>

      {pages.length === 0 ? (
        <p className={s.empty}>Aucune page pour le moment.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Lien</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
                <td>
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    /{page.slug}
                  </a>
                </td>
                <td>{page.status === "published" ? "Publiée" : "Brouillon"}</td>
                <td>
                  <span className={s.treeActions}>
                    <Link
                      href={`${ADMIN_BASE_PATH}/pages/${page.id}/edit`}
                      className={`${s.button} ${s.buttonSecondary}`}
                    >
                      Modifier
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deletePage(page.id);
                      }}
                    >
                      <ConfirmButton
                        className={`${s.button} ${s.buttonDanger}`}
                        confirmText={`Supprimer définitivement la page « ${page.title} » ? Cette action est irréversible.`}
                      >
                        Supprimer
                      </ConfirmButton>
                    </form>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

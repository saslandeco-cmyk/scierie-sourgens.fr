import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "./actions";
import { ADMIN_BASE_PATH } from "@/lib/auth";
import s from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { position: "asc" },
    include: {
      categories: { include: { parent: true } },
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Produits</h1>
        <Link href={`${ADMIN_BASE_PATH}/products/new`} className={s.button}>
          Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <p className={s.empty}>Aucun produit pour le moment.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Catégories</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.images[0] && <img src={product.images[0].url} alt={product.name} />}</td>
                <td>{product.name}</td>
                <td>
                  {product.categories
                    .map((c) => (c.parent ? `${c.parent.name} > ${c.name}` : c.name))
                    .join(", ")}
                </td>
                <td>
                  <span className={s.treeActions}>
                    <Link href={`${ADMIN_BASE_PATH}/products/${product.id}/edit`} className={`${s.button} ${s.buttonSecondary}`}>
                      Modifier
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProduct(product.id);
                      }}
                    >
                      <button type="submit" className={`${s.button} ${s.buttonDanger}`}>
                        Supprimer
                      </button>
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

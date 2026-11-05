import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "./actions";
import s from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { position: "asc" },
    include: { category: { include: { parent: true } } },
  });

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Produits</h1>
        <Link href="/admin/products/new" className={s.button}>
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
              <th>Catégorie</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.imageUrl && <img src={product.imageUrl} alt={product.name} />}</td>
                <td>{product.name}</td>
                <td>
                  {product.category.parent
                    ? `${product.category.parent.name} > ${product.category.name}`
                    : product.category.name}
                </td>
                <td>
                  <span className={s.treeActions}>
                    <Link href={`/admin/products/${product.id}/edit`} className={`${s.button} ${s.buttonSecondary}`}>
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

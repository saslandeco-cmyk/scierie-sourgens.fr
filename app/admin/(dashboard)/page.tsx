import Link from "next/link";
import { prisma } from "@/lib/prisma";
import s from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [categoryCount, subcategoryCount, productCount] = await Promise.all([
    prisma.category.count({ where: { parentId: null } }),
    prisma.category.count({ where: { parentId: { not: null } } }),
    prisma.product.count(),
  ]);

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Tableau de bord</h1>
      </div>
      <div className={s.card}>
        <p>{categoryCount} catégorie(s), {subcategoryCount} sous-catégorie(s), {productCount} produit(s).</p>
      </div>
      <div className={s.formActions}>
        <Link href="/admin/categories" className={s.button}>
          Gérer les catégories
        </Link>
        <Link href="/admin/products" className={s.button}>
          Gérer les produits
        </Link>
      </div>
    </div>
  );
}

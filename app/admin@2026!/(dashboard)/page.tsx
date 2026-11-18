import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ADMIN_BASE_PATH } from "@/lib/auth";
import s from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [categoryCount, subcategoryCount, productCount, pageCount] = await Promise.all([
    prisma.category.count({ where: { parentId: null } }),
    prisma.category.count({ where: { parentId: { not: null } } }),
    prisma.product.count(),
    prisma.page.count(),
  ]);

  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Tableau de bord</h1>
      </div>
      <div className={s.card}>
        <p>
          {categoryCount} catégorie(s), {subcategoryCount} sous-catégorie(s), {productCount} produit(s),{" "}
          {pageCount} page(s).
        </p>
      </div>
      <div className={s.formActions}>
        <Link href={`${ADMIN_BASE_PATH}/categories`} className={s.button}>
          Gérer les catégories
        </Link>
        <Link href={`${ADMIN_BASE_PATH}/products`} className={s.button}>
          Gérer les produits
        </Link>
        <Link href={`${ADMIN_BASE_PATH}/pages`} className={s.button}>
          Gérer les pages
        </Link>
      </div>
    </div>
  );
}

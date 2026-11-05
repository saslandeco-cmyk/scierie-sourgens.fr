"use client";

import Link from "next/link";
import s from "../../admin.module.css";

export default function CategoriesError({ error }: { error: Error }) {
  return (
    <div>
      <div className={s.pageHeader}>
        <h1>Catégories</h1>
      </div>
      <p className={s.formError}>{error.message}</p>
      <Link href="/admin/categories" className={s.button}>
        Retour
      </Link>
    </div>
  );
}

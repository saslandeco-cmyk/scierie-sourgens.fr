import Link from "next/link";
import { ADMIN_BASE_PATH } from "@/lib/auth";
import { logout } from "../actions";
import s from "../admin.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.shell}>
      <header className={s.shellHeader}>
        <nav className={s.shellNav}>
          <Link href={ADMIN_BASE_PATH}>Tableau de bord</Link>
          <Link href={`${ADMIN_BASE_PATH}/categories`}>Catégories</Link>
          <Link href={`${ADMIN_BASE_PATH}/products`}>Produits</Link>
        </nav>
        <form action={logout}>
          <button type="submit" className={s.logoutButton}>
            Déconnexion
          </button>
        </form>
      </header>
      <main className={s.shellMain}>{children}</main>
    </div>
  );
}

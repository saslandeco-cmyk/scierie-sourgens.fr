import Link from "next/link";
import { logout } from "../actions";
import s from "../admin.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.shell}>
      <header className={s.shellHeader}>
        <nav className={s.shellNav}>
          <Link href="/admin">Tableau de bord</Link>
          <Link href="/admin/categories">Catégories</Link>
          <Link href="/admin/products">Produits</Link>
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

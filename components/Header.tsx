"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CladdingIcon,
  DeckIcon,
  FirewoodIcon,
  ParquetIcon,
  PineCone,
  PlanksIcon,
  TreatmentIcon,
  TreesIcon,
} from "./Icons";
import s from "./home.module.css";

const links = [
  { href: "/#accueil", label: "Accueil" },
  { href: "/#histoire", label: "Notre histoire" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/#contact", label: "Contact" },
];

type NavSubcategory = { id: string; name: string; slug: string };
type NavCategory = { id: string; name: string; slug: string; children: NavSubcategory[] };

function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  if (slug.includes("interieur")) return <ParquetIcon className={className} />;
  if (slug.includes("exterieur")) return <TreesIcon className={className} />;
  if (slug.includes("bardage") || slug.includes("clin")) return <CladdingIcon className={className} />;
  if (slug.includes("terrasse")) return <DeckIcon className={className} />;
  if (slug.includes("charpente")) return <PlanksIcon className={className} />;
  if (slug.includes("chauffage") || slug.includes("buche")) return <FirewoodIcon className={className} />;
  if (slug.includes("entretien") || slug.includes("quincaillerie")) return <TreatmentIcon className={className} />;
  return <PineCone className={className} />;
}

export default function Header({ categories = [] }: { categories?: NavCategory[] }) {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(onHome ? "/#accueil" : "");
  const [productsOpen, setProductsOpen] = useState(false);

  const closeAll = () => {
    setOpen(false);
    setProductsOpen(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const isActive = (href: string) => {
    if (href === "/catalogue") return pathname.startsWith("/catalogue");
    return onHome && active === href;
  };

  return (
    <header className={s.header}>
      <Link href="/#accueil" className={s.brand} aria-label="Scierie R. Sourgens — accueil">
        <PineCone className={s.brandCone} />
        <span className={s.brandText}>
          <span className={s.brandName}>Scierie R. Sourgens</span>
          <span className={s.brandPlace}>Uza · Landes</span>
        </span>
      </Link>

      <button
        className={s.burger}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`${s.nav} ${open ? s.navOpen : ""}`}>
        <a
          href="/#accueil"
          className={isActive("/#accueil") ? s.navActive : undefined}
          onClick={() => {
            setActive("/#accueil");
            closeAll();
          }}
        >
          Accueil
        </a>

        <div
          className={s.navItem}
          onMouseEnter={() => setProductsOpen(true)}
          onMouseLeave={() => setProductsOpen(false)}
        >
          <span className={s.navItemRow}>
            <a
              href="/#produits"
              className={isActive("/#produits") ? s.navActive : undefined}
              onClick={() => {
                setActive("/#produits");
                closeAll();
              }}
            >
              Nos produits
            </a>
            {categories.length > 0 && (
              <button
                type="button"
                className={s.navCaret}
                aria-label="Afficher les catégories"
                aria-expanded={productsOpen}
                onClick={(e) => {
                  e.preventDefault();
                  setProductsOpen((p) => !p);
                }}
              >
                ▾
              </button>
            )}
          </span>

          {categories.length > 0 && (
            <div className={`${s.dropdownPanel} ${productsOpen ? s.dropdownPanelOpen : ""}`}>
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/catalogue/${category.slug}`} onClick={closeAll} className={s.navCategoryHeader}>
                      <CategoryIcon slug={category.slug} className={s.navCategoryIcon} />
                      {category.name}
                    </Link>
                    {category.children.length > 0 && (
                      <ul>
                        {category.children.map((sub) => (
                          <li key={sub.id}>
                            <Link href={`/catalogue/${category.slug}/${sub.slug}`} onClick={closeAll}>
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {links
          .filter((l) => l.href !== "/#accueil")
          .map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={isActive(l.href) ? s.navActive : undefined}
              onClick={() => {
                setActive(l.href);
                closeAll();
              }}
            >
              {l.label}
            </a>
          ))}
      </nav>
    </header>
  );
}

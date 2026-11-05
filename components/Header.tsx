"use client";

import { useState } from "react";
import Link from "next/link";
import { PineCone } from "./Icons";
import s from "./home.module.css";

const links = [
  { href: "#accueil", label: "Accueil" },
  { href: "#histoire", label: "Notre histoire" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "#contact", label: "Contact" },
];

type NavSubcategory = { id: string; name: string; slug: string };
type NavCategory = { id: string; name: string; slug: string; children: NavSubcategory[] };

export default function Header({ categories = [] }: { categories?: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#accueil");
  const [productsOpen, setProductsOpen] = useState(false);

  const closeAll = () => {
    setOpen(false);
    setProductsOpen(false);
  };

  return (
    <header className={s.header}>
      <Link href="#accueil" className={s.brand} aria-label="Scierie R. Sourgens — accueil">
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
          href="#accueil"
          className={active === "#accueil" ? s.navActive : undefined}
          onClick={() => {
            setActive("#accueil");
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
              href="#produits"
              className={active === "#produits" ? s.navActive : undefined}
              onClick={() => {
                setActive("#produits");
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
                    <Link href={`/catalogue/${category.slug}`} onClick={closeAll}>
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
          .filter((l) => l.href !== "#accueil")
          .map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? s.navActive : undefined}
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

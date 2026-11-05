"use client";

import { useState } from "react";
import Link from "next/link";
import { PineCone } from "./Icons";
import s from "./home.module.css";

const links = [
  { href: "#accueil", label: "Accueil" },
  { href: "#histoire", label: "Notre histoire" },
  { href: "#produits", label: "Nos produits" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#accueil");

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
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={active === l.href ? s.navActive : undefined}
            onClick={() => {
              setActive(l.href);
              setOpen(false);
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

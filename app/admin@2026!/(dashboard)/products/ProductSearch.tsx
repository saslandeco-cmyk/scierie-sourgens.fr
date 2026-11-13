"use client";

import { useState } from "react";
import s from "../../admin.module.css";

export default function ProductSearch() {
  const [value, setValue] = useState("");

  function handleChange(next: string) {
    setValue(next);
    const needle = next.trim().toLowerCase();
    document.querySelectorAll<HTMLTableRowElement>("[data-product-name]").forEach((row) => {
      const name = row.dataset.productName ?? "";
      row.style.display = name.includes(needle) ? "" : "none";
    });
  }

  return (
    <div className={s.searchBar}>
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Rechercher un produit par nom..."
        className={s.searchInput}
        aria-label="Rechercher un produit"
      />
    </div>
  );
}

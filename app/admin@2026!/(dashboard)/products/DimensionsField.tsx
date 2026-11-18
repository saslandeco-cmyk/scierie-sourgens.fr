"use client";

import { useState } from "react";
import s from "../../admin.module.css";

export type DimensionDefault = {
  dimension: string;
  price: number | null;
  priceUnitSuffix?: string | null;
  description?: string | null;
};

type Row = DimensionDefault & { key: string };

type Props = {
  defaults?: DimensionDefault[];
};

let rowCounter = 0;
function nextKey() {
  rowCounter += 1;
  return `row-${rowCounter}`;
}

export default function DimensionsField({ defaults }: Props) {
  const [rows, setRows] = useState<Row[]>(() => (defaults ?? []).map((d) => ({ ...d, key: nextKey() })));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function addRow() {
    setRows((prev) => [...prev, { key: nextKey(), dimension: "", price: null, priceUnitSuffix: "", description: "" }]);
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  function moveRow(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    setRows((prev) => {
      if (to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  return (
    <fieldset className={s.checkboxList}>
      <legend>Dimensions, prix et description</legend>
      {rows.map((row, i) => (
        <div
          key={row.key}
          className={`${s.dimensionRow} ${dragIndex === i ? s.dimensionRowDragging : ""} ${overIndex === i && dragIndex !== null && dragIndex !== i ? s.dimensionRowDragOver : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragIndex !== null && overIndex !== i) setOverIndex(i);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex !== null) moveRow(dragIndex, i);
            setDragIndex(null);
            setOverIndex(null);
          }}
        >
          <div className={s.dimensionRowTop}>
            <span
              className={s.dimensionDragHandle}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              aria-label="Glisser pour réordonner"
              title="Glisser pour réordonner"
            >
              ⠿
            </span>
            <input type="text" name="dimension" placeholder="ex. 2.40m/170/15mm" defaultValue={row.dimension} />
            <input type="number" name="dimensionPrice" step="0.01" min="0" placeholder="Prix (€)" defaultValue={row.price ?? ""} />
            <input
              type="text"
              name="dimensionPriceUnitSuffix"
              placeholder="Précision unité (optionnel)"
              defaultValue={row.priceUnitSuffix ?? ""}
            />
            <button type="button" onClick={() => removeRow(row.key)} aria-label="Retirer cette dimension">
              ×
            </button>
          </div>
          <textarea name="dimensionDescription" rows={2} placeholder="Description de cette dimension" defaultValue={row.description ?? ""} />
        </div>
      ))}
      <button type="button" className={`${s.button} ${s.buttonSecondary}`} onClick={addRow}>
        Ajouter une dimension
      </button>
    </fieldset>
  );
}

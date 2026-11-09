"use client";

import { useState } from "react";
import s from "../../admin.module.css";

export type DimensionDefault = { dimension: string; price: number | null; description?: string | null };

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

  function addRow() {
    setRows((prev) => [...prev, { key: nextKey(), dimension: "", price: null, description: "" }]);
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  return (
    <fieldset className={s.checkboxList}>
      <legend>Dimensions, prix et description</legend>
      {rows.map((row) => (
        <div key={row.key} className={s.dimensionRow}>
          <div className={s.dimensionRowTop}>
            <input type="text" name="dimension" placeholder="ex. 2.40m/170/15mm" defaultValue={row.dimension} />
            <input type="number" name="dimensionPrice" step="0.01" min="0" placeholder="Prix (€)" defaultValue={row.price ?? ""} />
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

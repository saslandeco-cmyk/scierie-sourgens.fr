"use client";

import { useState } from "react";
import s from "../../admin.module.css";
import { BLOCK_TYPES, BLOCK_TYPE_LABELS, type BlockType } from "@/lib/pageBlocks";
import RichTextBlockFields from "./blocks/RichTextBlockFields";
import ImageBlockFields from "./blocks/ImageBlockFields";
import GalleryBlockFields from "./blocks/GalleryBlockFields";
import CtaBlockFields from "./blocks/CtaBlockFields";

export type BlockRowDefault = { type: BlockType; data: Record<string, unknown> };

type Row = BlockRowDefault & { key: string };

type Props = {
  defaults?: BlockRowDefault[];
};

let rowCounter = 0;
function nextKey() {
  rowCounter += 1;
  return `block-${rowCounter}`;
}

function emptyData(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "richText":
      return { html: "" };
    case "image":
      return { existingUrl: null, alt: "" };
    case "gallery":
      return { existingUrls: [] };
    case "cta":
      return { text: "", href: "", style: "primary" };
  }
}

export default function PageBlocksField({ defaults }: Props) {
  const [rows, setRows] = useState<Row[]>(() => (defaults ?? []).map((b) => ({ ...b, key: nextKey() })));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  function addBlock(type: BlockType) {
    setRows((prev) => [...prev, { key: nextKey(), type, data: emptyData(type) }]);
    setAdding(false);
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  function updateRowData(key: string, patch: Record<string, unknown>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, data: { ...r.data, ...patch } } : r)));
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
      <legend>Contenu de la page (blocs)</legend>
      <input type="hidden" name="blockCount" value={rows.length} readOnly />

      {rows.map((row, i) => (
        <div
          key={row.key}
          className={[
            s.blockRow,
            dragIndex === i ? s.blockRowDragging : "",
            overIndex === i && dragIndex !== null && dragIndex !== i ? s.blockRowDragOver : "",
          ]
            .filter(Boolean)
            .join(" ")}
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
          <div className={s.blockRowHeader}>
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
            <span className={s.blockTypeBadge}>{BLOCK_TYPE_LABELS[row.type]}</span>
            <button type="button" onClick={() => removeRow(row.key)} aria-label="Retirer ce bloc">
              ×
            </button>
          </div>

          <input type="hidden" name={`block_${i}_type`} value={row.type} readOnly />
          <input type="hidden" name={`block_${i}_data`} value={JSON.stringify(row.data)} readOnly />

          {row.type === "richText" && (
            <RichTextBlockFields
              index={i}
              data={row.data as { html: string }}
              onChange={(patch) => updateRowData(row.key, patch)}
            />
          )}
          {row.type === "image" && (
            <ImageBlockFields
              index={i}
              data={row.data as { existingUrl: string | null; alt: string }}
              onChange={(patch) => updateRowData(row.key, patch)}
            />
          )}
          {row.type === "gallery" && (
            <GalleryBlockFields
              index={i}
              data={row.data as { existingUrls: string[] }}
              onChange={(patch) => updateRowData(row.key, patch)}
            />
          )}
          {row.type === "cta" && (
            <CtaBlockFields
              data={row.data as { text: string; href: string; style: "primary" | "secondary" }}
              onChange={(patch) => updateRowData(row.key, patch)}
            />
          )}
        </div>
      ))}

      <div className={s.blockPicker}>
        {adding ? (
          <>
            {BLOCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`${s.button} ${s.buttonSecondary}`}
                onClick={() => addBlock(type)}
              >
                {BLOCK_TYPE_LABELS[type]}
              </button>
            ))}
            <button type="button" className={s.button} onClick={() => setAdding(false)}>
              Annuler
            </button>
          </>
        ) : (
          <button type="button" className={`${s.button} ${s.buttonSecondary}`} onClick={() => setAdding(true)}>
            Ajouter un bloc
          </button>
        )}
      </div>
    </fieldset>
  );
}

"use client";

import { useEffect } from "react";
import s from "./catalogue.module.css";

type LightboxImage = { url: string; alt?: string };

type Props = {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function Lightbox({ images, index, onClose, onIndexChange }: Props) {
  const hasMultiple = images.length > 1;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMultiple) onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft" && hasMultiple) onIndexChange((index - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [index, images.length, hasMultiple, onClose, onIndexChange]);

  const current = images[index];
  if (!current) return null;

  return (
    <div className={s.lightbox} onClick={onClose}>
      <button type="button" className={s.lightboxClose} onClick={onClose} aria-label="Fermer">
        ×
      </button>

      {hasMultiple && (
        <button
          type="button"
          className={`${s.lightboxNav} ${s.lightboxPrev}`}
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange((index - 1 + images.length) % images.length);
          }}
          aria-label="Image précédente"
        >
          ‹
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.url}
        alt={current.alt ?? ""}
        className={s.lightboxImage}
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <button
          type="button"
          className={`${s.lightboxNav} ${s.lightboxNext}`}
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange((index + 1) % images.length);
          }}
          aria-label="Image suivante"
        >
          ›
        </button>
      )}
    </div>
  );
}

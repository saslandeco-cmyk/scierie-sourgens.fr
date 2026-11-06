"use client";

import { useState } from "react";
import Image from "next/image";
import s from "./catalogue.module.css";

type GalleryImage = { id: string; url: string };

export default function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) return null;

  return (
    <div>
      <div className={s.productImage}>
        <Image src={images[selected].url} alt={name} fill sizes="(max-width: 480px) 100vw, 500px" />
      </div>

      {images.length > 1 && (
        <div className={s.productThumbs}>
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={`${s.productThumb} ${i === selected ? s.productThumbActive : ""}`}
              onClick={() => setSelected(i)}
              aria-label={`Voir la photo ${i + 1} de ${name}`}
              aria-pressed={i === selected}
            >
              <Image src={img.url} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

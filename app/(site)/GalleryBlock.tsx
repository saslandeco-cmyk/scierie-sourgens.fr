"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./catalogue/Lightbox";
import s from "./pages.module.css";

export default function GalleryBlock({ images }: { images: { url: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className={s.galleryGrid}>
        {images.map((img, i) => (
          <button
            key={img.url}
            type="button"
            className={s.galleryImage}
            onClick={() => setOpenIndex(i)}
            aria-label="Agrandir la photo"
          >
            <Image src={img.url} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={images.map((img) => ({ url: img.url }))}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}

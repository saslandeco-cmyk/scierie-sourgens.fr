"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import s from "./catalogue.module.css";

type RealisationImage = { id: string; url: string };

export default function RealisationsGallery({ images }: { images: RealisationImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className={s.realisationsGrid}>
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            className={`${s.realisationImage} ${s.zoomable}`}
            onClick={() => setOpenIndex(i)}
            aria-label="Agrandir la photo"
          >
            <Image src={img.url} alt="Réalisation client" fill sizes="(max-width: 700px) 50vw, 25vw" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={images.map((img) => ({ url: img.url, alt: "Réalisation client" }))}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}

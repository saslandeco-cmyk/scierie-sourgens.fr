"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";
import s from "./catalogue.module.css";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className: string;
};

export default function ZoomableImage({ src, alt, sizes, className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`${className} ${s.zoomable}`}
        onClick={() => setOpen(true)}
        aria-label={`Agrandir la photo${alt ? ` de ${alt}` : ""}`}
      >
        <Image src={src} alt={alt} fill sizes={sizes} />
      </button>

      {open && (
        <Lightbox images={[{ url: src, alt }]} index={0} onClose={() => setOpen(false)} onIndexChange={() => {}} />
      )}
    </>
  );
}

import ZoomableImage from "./catalogue/ZoomableImage";
import GalleryBlock from "./GalleryBlock";
import s from "./pages.module.css";

type Props = {
  type: string;
  data: unknown;
};

export default function BlockRenderer({ type, data }: Props) {
  if (type === "richText") {
    const { html } = data as { html: string };
    return <div className={s.richTextBlock} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  if (type === "image") {
    const { url, alt } = data as { url: string; alt: string };
    return <ZoomableImage src={url} alt={alt} sizes="(max-width: 900px) 90vw, 900px" className={s.imageBlock} />;
  }

  if (type === "gallery") {
    const { images } = data as { images: { url: string }[] };
    return <GalleryBlock images={images} />;
  }

  if (type === "cta") {
    const { text, href, style } = data as { text: string; href: string; style: "primary" | "secondary" };
    return (
      <a href={href} className={style === "secondary" ? `${s.ctaButton} ${s.ctaButtonSecondary}` : s.ctaButton}>
        {text}
      </a>
    );
  }

  return null;
}

export const BLOCK_TYPES = ["richText", "image", "gallery", "cta"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  richText: "Texte riche",
  image: "Image",
  gallery: "Galerie d'images",
  cta: "Bouton / appel à l'action",
};

export type RichTextBlockData = { html: string };
export type ImageBlockData = { url: string; alt: string };
export type GalleryBlockData = { images: { url: string }[] };
export type CtaBlockData = { text: string; href: string; style: "primary" | "secondary" };

export type BlockData = RichTextBlockData | ImageBlockData | GalleryBlockData | CtaBlockData;

/**
 * Converts a block's stored DB shape into the shape the admin editor rows
 * expect (e.g. a single image's `url` becomes `existingUrl` so the editor
 * can tell "already saved" apart from "freshly picked, not uploaded yet").
 */
export function blockDataToRow(type: BlockType, data: Record<string, unknown>): Record<string, unknown> {
  switch (type) {
    case "richText":
      return { html: (data as RichTextBlockData).html ?? "" };
    case "image":
      return { existingUrl: (data as ImageBlockData).url ?? null, alt: (data as ImageBlockData).alt ?? "" };
    case "gallery":
      return { existingUrls: ((data as GalleryBlockData).images ?? []).map((img) => img.url) };
    case "cta": {
      const cta = data as CtaBlockData;
      return { text: cta.text ?? "", href: cta.href ?? "", style: cta.style ?? "primary" };
    }
  }
}

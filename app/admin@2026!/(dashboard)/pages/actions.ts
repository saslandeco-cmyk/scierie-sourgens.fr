"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { deleteImage, uploadImage } from "@/lib/blob";
import { ADMIN_BASE_PATH } from "@/lib/auth";
import { sanitizeRichText } from "@/lib/sanitizeHtml";
import { BLOCK_TYPES, type BlockType } from "@/lib/pageBlocks";
import { PAGE_STATUS_OPTIONS } from "@/lib/pageStatus";

const PAGES_PATH = `${ADMIN_BASE_PATH}/pages`;
const RESERVED_SLUGS = new Set(["catalogue", "admin", "admin@2026!", "api"]);

export type PageFormState = { error?: string };

const pageSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  status: z.enum(PAGE_STATUS_OPTIONS).default("draft"),
});

function parsePageForm(formData: FormData) {
  return pageSchema.safeParse({
    title: formData.get("title"),
    status: formData.get("status") || undefined,
  });
}

const richTextDataSchema = z.object({ html: z.string() });
const imageDataSchema = z.object({
  alt: z.string().optional().default(""),
  existingUrl: z.string().url().nullable().optional(),
});
const galleryDataSchema = z.object({ existingUrls: z.array(z.string().url()).default([]) });
const ctaDataSchema = z.object({
  text: z.string().min(1),
  href: z.string().min(1),
  style: z.enum(["primary", "secondary"]).default("primary"),
});

type ParsedBlock = { type: BlockType; data: Record<string, unknown> };

async function parseBlocks(formData: FormData): Promise<{ data: ParsedBlock[] } | { error: string }> {
  const count = Number(formData.get("blockCount") ?? 0);
  const result: ParsedBlock[] = [];

  for (let i = 0; i < count; i++) {
    const rawType = String(formData.get(`block_${i}_type`) ?? "");
    if (!BLOCK_TYPES.includes(rawType as BlockType)) {
      return { error: `Bloc #${i + 1} invalide.` };
    }
    const type = rawType as BlockType;

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(String(formData.get(`block_${i}_data`) ?? "{}"));
    } catch {
      return { error: `Bloc #${i + 1} illisible.` };
    }

    if (type === "richText") {
      const r = richTextDataSchema.safeParse(parsedData);
      if (!r.success) return { error: `Bloc texte #${i + 1} invalide.` };
      result.push({ type, data: { html: sanitizeRichText(r.data.html) ?? "" } });
    } else if (type === "image") {
      const r = imageDataSchema.safeParse(parsedData);
      if (!r.success) return { error: `Bloc image #${i + 1} invalide.` };
      const file = formData.get(`block_${i}_image`);
      const url = file instanceof File && file.size > 0 ? await uploadImage(file, "pages") : r.data.existingUrl;
      if (!url) return { error: `Le bloc image #${i + 1} nécessite une photo.` };
      result.push({ type, data: { url, alt: r.data.alt } });
    } else if (type === "gallery") {
      const r = galleryDataSchema.safeParse(parsedData);
      if (!r.success) return { error: `Bloc galerie #${i + 1} invalide.` };
      const newFiles = formData.getAll(`block_${i}_images`).filter((f): f is File => f instanceof File && f.size > 0);
      const newUrls = await Promise.all(newFiles.map((f) => uploadImage(f, "pages")));
      result.push({ type, data: { images: [...r.data.existingUrls, ...newUrls].map((url) => ({ url })) } });
    } else {
      const r = ctaDataSchema.safeParse(parsedData);
      if (!r.success) return { error: `Bloc bouton #${i + 1} invalide.` };
      result.push({ type, data: r.data });
    }
  }

  return { data: result };
}

function collectImageUrls(blocks: { type: string; data: unknown }[]): string[] {
  const urls: string[] = [];
  for (const b of blocks) {
    if (b.type === "image") {
      const url = (b.data as { url?: string }).url;
      if (url) urls.push(url);
    }
    if (b.type === "gallery") {
      const images = (b.data as { images?: { url: string }[] }).images ?? [];
      for (const img of images) urls.push(img.url);
    }
  }
  return urls;
}

async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  if (RESERVED_SLUGS.has(slug)) return true;
  const existing = await prisma.page.findUnique({ where: { slug } });
  return Boolean(existing && existing.id !== excludeId);
}

export async function createPage(_prevState: PageFormState, formData: FormData): Promise<PageFormState> {
  const parsed = parsePageForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const blocksResult = await parseBlocks(formData);
  if ("error" in blocksResult) {
    return { error: blocksResult.error };
  }

  try {
    const slug = await uniqueSlug(parsed.data.title, (candidate) => isSlugTaken(candidate));

    await prisma.page.create({
      data: {
        title: parsed.data.title,
        slug,
        status: parsed.data.status,
        blocks: { create: blocksResult.data.map((b, i) => ({ type: b.type, data: b.data as Prisma.InputJsonValue, position: i })) },
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inattendue." };
  }

  revalidatePath(PAGES_PATH);
  redirect(PAGES_PATH);
}

export async function updatePage(id: string, _prevState: PageFormState, formData: FormData): Promise<PageFormState> {
  const parsed = parsePageForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const blocksResult = await parseBlocks(formData);
  if ("error" in blocksResult) {
    return { error: blocksResult.error };
  }

  let slug = "";
  let oldSlug = "";

  try {
    const current = await prisma.page.findUnique({ where: { id }, include: { blocks: true } });
    if (!current) {
      return { error: "Page introuvable." };
    }
    oldSlug = current.slug;

    slug = await uniqueSlug(parsed.data.title, (candidate) => isSlugTaken(candidate, id), current.slug);

    const oldImageUrls = collectImageUrls(current.blocks);
    const newImageUrls = collectImageUrls(blocksResult.data);
    const imagesToDelete = oldImageUrls.filter((u) => !newImageUrls.includes(u));

    await prisma.page.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug,
        status: parsed.data.status,
        blocks: {
          deleteMany: {},
          create: blocksResult.data.map((b, i) => ({ type: b.type, data: b.data as Prisma.InputJsonValue, position: i })),
        },
      },
    });

    await Promise.all(imagesToDelete.map((url) => deleteImage(url)));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inattendue." };
  }

  revalidatePath(PAGES_PATH);
  revalidatePath(`/${slug}`);
  if (slug !== oldSlug) revalidatePath(`/${oldSlug}`);
  redirect(PAGES_PATH);
}

export async function deletePage(id: string) {
  const page = await prisma.page.findUnique({ where: { id }, include: { blocks: true } });
  if (!page) return;

  await prisma.page.delete({ where: { id } });
  await Promise.all(collectImageUrls(page.blocks).map((url) => deleteImage(url)));

  revalidatePath(PAGES_PATH);
  revalidatePath(`/${page.slug}`);
}

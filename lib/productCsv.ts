import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { prisma } from "@/lib/prisma";
import { getFlatCategoryOptions } from "@/lib/catalog";
import { uniqueSlug } from "@/lib/slug";
import { deleteImage } from "@/lib/blob";
import { UNIT_OPTIONS, STATUS_OPTIONS } from "@/lib/priceUnits";

export const CSV_COLUMNS = [
  "name",
  "description",
  "dimensions",
  "priceUnit",
  "priceStatus",
  "categories",
  "images",
  "position",
] as const;

export async function exportProductsCsv(): Promise<string> {
  const products = await prisma.product.findMany({
    orderBy: { position: "asc" },
    include: {
      categories: { include: { parent: true } },
      images: { orderBy: { position: "asc" } },
      dimensions: { orderBy: { position: "asc" } },
    },
  });

  const rows = products.map((product) => ({
    name: product.name,
    description: product.description ?? "",
    dimensions: product.dimensions.map((d) => `${d.dimension}:${d.price ?? ""}`).join(" | "),
    priceUnit: product.priceUnit ?? "",
    priceStatus: product.priceStatus ?? "",
    categories: product.categories
      .map((c) => (c.parent ? `${c.parent.name} > ${c.name}` : c.name))
      .join(" | "),
    images: product.images.map((img) => img.url).join(" | "),
    position: String(product.position),
  }));

  return stringify(rows, { header: true, columns: CSV_COLUMNS as unknown as string[], quoted: true });
}

export type ImportRowResult = { row: number; name: string; status: "created" | "updated" | "error"; message?: string };

export type ImportSummary = {
  created: number;
  updated: number;
  errors: number;
  details: ImportRowResult[];
};

export async function importProductsCsv(csvContent: string): Promise<ImportSummary> {
  const records: Record<string, string>[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const categoryOptions = await getFlatCategoryOptions();
  const labelToId = new Map(categoryOptions.map((c) => [c.label.trim().toLowerCase(), c.id]));

  const summary: ImportSummary = { created: 0, updated: 0, errors: 0, details: [] };

  for (let i = 0; i < records.length; i++) {
    const rowNumber = i + 2; // +1 for 0-index, +1 for header row
    const record = records[i];
    const name = (record.name ?? "").trim();

    if (!name) {
      summary.errors++;
      summary.details.push({ row: rowNumber, name: "(sans nom)", status: "error", message: "Le nom est requis." });
      continue;
    }

    try {
      const categoryLabels = (record.categories ?? "")
        .split("|")
        .map((l) => l.trim())
        .filter(Boolean);

      const categoryIds: string[] = [];
      const unknownLabels: string[] = [];
      for (const label of categoryLabels) {
        const id = labelToId.get(label.toLowerCase());
        if (id) {
          categoryIds.push(id);
        } else {
          unknownLabels.push(label);
        }
      }

      if (categoryIds.length === 0) {
        throw new Error(
          unknownLabels.length > 0
            ? `Catégorie(s) introuvable(s) : ${unknownLabels.join(", ")}`
            : "Choisissez au moins une catégorie.",
        );
      }

      const imageUrls = (record.images ?? "")
        .split("|")
        .map((u) => u.trim())
        .filter(Boolean);

      const description = (record.description ?? "").trim() || null;
      const position = Number.parseInt(record.position ?? "0", 10) || 0;

      const dimensionEntries = (record.dimensions ?? "")
        .split("|")
        .map((entry) => entry.trim())
        .filter(Boolean);

      const dimensions: { dimension: string; price: number | null }[] = [];
      for (const entry of dimensionEntries) {
        const sep = entry.indexOf(":");
        const dimension = (sep >= 0 ? entry.slice(0, sep) : entry).trim();
        const priceRaw = (sep >= 0 ? entry.slice(sep + 1) : "").trim().replace(",", ".");
        let price: number | null = null;
        if (priceRaw) {
          price = Number.parseFloat(priceRaw);
          if (Number.isNaN(price)) {
            throw new Error(`Prix invalide pour la dimension "${dimension}" : "${priceRaw}"`);
          }
        }
        dimensions.push({ dimension, price });
      }

      const priceUnitRaw = (record.priceUnit ?? "").trim();
      if (priceUnitRaw && !UNIT_OPTIONS.includes(priceUnitRaw as (typeof UNIT_OPTIONS)[number])) {
        throw new Error(`Unité de prix invalide : "${priceUnitRaw}" (attendu : ${UNIT_OPTIONS.join(", ")})`);
      }

      const priceStatusRaw = (record.priceStatus ?? "").trim();
      if (priceStatusRaw && !STATUS_OPTIONS.includes(priceStatusRaw as (typeof STATUS_OPTIONS)[number])) {
        throw new Error(`Statut invalide : "${priceStatusRaw}" (attendu : ${STATUS_OPTIONS.join(", ")})`);
      }

      const priceUnit = priceUnitRaw || null;
      const priceStatus = priceStatusRaw || null;

      const existing = await prisma.product.findFirst({
        where: { name: { equals: name, mode: "insensitive" } },
        include: { images: true },
      });

      if (existing) {
        const oldUrls = new Set(existing.images.map((img) => img.url));
        const newUrls = new Set(imageUrls);
        const removedUrls = [...oldUrls].filter((u) => !newUrls.has(u));

        await prisma.product.update({
          where: { id: existing.id },
          data: {
            name,
            description,
            priceUnit,
            priceStatus,
            position,
            categories: { set: categoryIds.map((id) => ({ id })) },
            images: {
              deleteMany: {},
              create: imageUrls.map((url, idx) => ({ url, position: idx })),
            },
            dimensions: {
              deleteMany: {},
              create: dimensions.map((d, idx) => ({ ...d, position: idx })),
            },
          },
        });

        await Promise.all(removedUrls.map((url) => deleteImage(url)));

        summary.updated++;
        summary.details.push({ row: rowNumber, name, status: "updated" });
      } else {
        const slug = await uniqueSlug(name, async (s) => {
          const taken = await prisma.product.findUnique({ where: { slug: s } });
          return Boolean(taken);
        });

        await prisma.product.create({
          data: {
            name,
            slug,
            description,
            priceUnit,
            priceStatus,
            position,
            categories: { connect: categoryIds.map((id) => ({ id })) },
            images: { create: imageUrls.map((url, idx) => ({ url, position: idx })) },
            dimensions: { create: dimensions.map((d, idx) => ({ ...d, position: idx })) },
          },
        });

        summary.created++;
        summary.details.push({ row: rowNumber, name, status: "created" });
      }
    } catch (err) {
      summary.errors++;
      summary.details.push({
        row: rowNumber,
        name,
        status: "error",
        message: err instanceof Error ? err.message : "Erreur inattendue.",
      });
    }
  }

  return summary;
}

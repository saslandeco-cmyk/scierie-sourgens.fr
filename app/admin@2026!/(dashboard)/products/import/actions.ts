"use server";

import { revalidatePath } from "next/cache";
import { importProductsCsv, type ImportSummary } from "@/lib/productCsv";
import { ADMIN_BASE_PATH } from "@/lib/auth";

export type ImportState = { summary?: ImportSummary; error?: string };

export async function importProducts(_prevState: ImportState, formData: FormData): Promise<ImportState> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choisissez un fichier CSV." };
  }

  try {
    const content = await file.text();
    const summary = await importProductsCsv(content);

    revalidatePath(`${ADMIN_BASE_PATH}/products`);
    revalidatePath("/catalogue");
    revalidatePath("/");

    return { summary };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Le fichier n'a pas pu être lu." };
  }
}

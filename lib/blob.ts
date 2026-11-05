import { del, put } from "@vercel/blob";

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const pathname = `products/${crypto.randomUUID()}.${ext}`;
  const blob = await put(pathname, file, { access: "public" });
  return blob.url;
}

export async function deleteProductImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // image already gone, nothing to do
  }
}

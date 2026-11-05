import { del, put } from "@vercel/blob";

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const pathname = `${folder}/${crypto.randomUUID()}.${ext}`;
  const blob = await put(pathname, file, { access: "public" });
  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // image already gone, nothing to do
  }
}

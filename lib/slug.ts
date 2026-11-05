export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
  excludeSlug?: string,
): Promise<string> {
  const root = slugify(base) || "item";
  let candidate = root;
  let n = 2;
  while (candidate !== excludeSlug && (await isTaken(candidate))) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

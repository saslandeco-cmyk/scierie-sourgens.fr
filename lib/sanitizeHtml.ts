const ALLOWED_TAGS = new Set(["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "h3", "a", "blockquote"]);

function sanitizeHref(raw: string): string {
  const href = raw.trim();
  if (/^(https?:|mailto:)/i.test(href) || href.startsWith("/")) return href;
  return "";
}

/**
 * Minimal allowlist-based sanitizer for HTML produced by the admin rich text
 * editor. Not a general-purpose HTML sanitizer (regex-based, no DOM parser
 * available server-side without a new dependency) — safe only because the
 * input always comes from our own contentEditable editor's limited command
 * set, never from public-facing form submissions.
 */
export function sanitizeRichText(html: string | null | undefined): string | null {
  if (!html) return null;

  let out = html.replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");

  out = out.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, rawTag: string, attrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";

    const isClosing = match.startsWith("</");
    if (isClosing) return `</${tag}>`;

    if (tag === "a") {
      const hrefMatch = attrs.match(/href\s*=\s*"([^"]*)"|href\s*=\s*'([^']*)'/i);
      const href = hrefMatch ? sanitizeHref(hrefMatch[1] ?? hrefMatch[2] ?? "") : "";
      return href ? `<a href="${href.replace(/"/g, "&quot;")}" rel="noopener noreferrer" target="_blank">` : "<a>";
    }

    return `<${tag}>`;
  });

  const trimmed = out.trim();
  return trimmed || null;
}

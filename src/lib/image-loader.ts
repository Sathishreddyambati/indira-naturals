// Used only for the GitHub Pages build: serves images as-is, with the site's base path in front.
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith("/")) return src;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}?w=${width}`;
}

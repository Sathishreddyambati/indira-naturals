import Image from "next/image";
import type { CSSProperties } from "react";

const LOGO = "/images/logo-sm.png";

// The logo with a band of light that sweeps left to right over its letters only.
// `loop` repeats the sweep every few seconds; otherwise it plays once after `delay` seconds.
export default function ShineLogo({
  className = "",
  imgClassName = "",
  delay = 0.8,
  loop = false,
  priority = false,
  alt = "Indira Naturals — Pure, Fresh, Natural",
}: {
  className?: string;
  imgClassName?: string;
  delay?: number;
  loop?: boolean;
  priority?: boolean;
  alt?: string;
}) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const style = { "--shine-mask": `url('${base}${LOGO}')`, "--shine-delay": `${delay}s` } as CSSProperties;
  return (
    <span className={`shine-logo ${loop ? "shine-loop" : ""} ${className}`} style={style}>
      <Image src={LOGO} alt={alt} width={560} height={315} priority={priority} className={imgClassName} />
      <span aria-hidden className="shine-sweep" />
    </span>
  );
}

"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

// Top border theme (village art). The home page shows it inside the hero box instead.
export default function ThemeTop() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div aria-hidden className="theme-fade-bottom relative h-[clamp(90px,13vw,220px)] w-full overflow-hidden">
      <Image src="/images/theme/top.jpg" alt="" fill priority sizes="100vw" className="object-cover object-bottom" />
    </div>
  );
}

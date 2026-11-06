"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : ["/images/logo.png"];

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-brand-sand-light/70">
        <Image
          src={list[active]}
          alt={`${name} — product photo ${active + 1}`}
          fill
          priority
          sizes="(min-width:1024px) 560px, 95vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {list.length > 1 && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {list.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 bg-brand-sand-light sm:h-[4.5rem] sm:w-[4.5rem] ${
                i === active ? "border-brand-forest" : "border-transparent"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

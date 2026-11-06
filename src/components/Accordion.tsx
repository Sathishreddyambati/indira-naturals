"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ items }: { items: { question: string; answer: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-brand-brown/15 border-y border-brand-brown/15">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="font-medium text-brand-charcoal">{item.question}</span>
            <ChevronDown
              size={18}
              className={`flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="pb-4 text-sm leading-relaxed text-brand-charcoal/70">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}

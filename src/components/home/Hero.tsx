"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ShineLogo from "@/components/ShineLogo";

const POINTS = ["100% Pure & Natural", "No Preservatives", "No Additives"];

// Intro: one big glassy box with the top village theme, logo + info on the left, products on the right.
export default function Hero({
  headline,
  subtext,
  ctaPrimary,
  ctaSecondary,
}: {
  headline: string;
  subtext: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="container-site pt-6 lg:pt-10">
      <div className="glass block-sand relative overflow-hidden rounded-[2rem]">
        {/* top theme art */}
        <div aria-hidden className="theme-fade-bottom absolute inset-x-0 top-0 h-[clamp(110px,16vw,260px)]">
          <Image src="/images/theme/top.jpg" alt="" fill priority sizes="100vw" className="object-cover object-bottom" />
        </div>

        <div className="relative grid grid-cols-1 items-center gap-8 px-6 pb-10 pt-[clamp(110px,14vw,220px)] sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:pb-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <ShineLogo priority loop delay={1.2} className="logo-glow w-[min(100%,340px)]" imgClassName="h-auto w-full" />
            <h1 className="mt-5 font-serif text-balance text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.08] text-brand-forest">
              {headline}
            </h1>
            <p className="mt-4 max-w-xl text-balance text-base text-brand-charcoal/75 sm:text-lg">{subtext}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {POINTS.map((p) => (
                <li
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-leaf/30 bg-brand-sand-light/70 px-3 py-1.5 text-xs font-semibold text-brand-forest"
                >
                  <Check size={14} className="text-brand-leaf" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-brand-forest px-7 py-3.5 text-sm font-semibold text-brand-ivory shadow-[0_10px_30px_rgba(23,77,42,0.25)] transition-transform hover:-translate-y-0.5 hover:bg-brand-leaf"
              >
                {ctaPrimary}
              </Link>
              <Link
                href="/our-story"
                className="rounded-full border border-brand-forest/40 bg-brand-sand-light/60 px-7 py-3.5 text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-forest hover:text-brand-ivory"
              >
                {ctaSecondary}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Image
              src="/images/hero-pouches.png"
              alt="Indira Naturals Ginger, Ginger Garlic and Garlic powder packs"
              width={1200}
              height={900}
              priority
              sizes="(min-width: 1024px) 600px, 92vw"
              className="h-auto w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

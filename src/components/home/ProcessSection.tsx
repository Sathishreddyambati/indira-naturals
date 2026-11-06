import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import BrandIcon from "@/components/BrandIcon";
import { PROCESS_STEPS, TRUST_BADGES } from "@/lib/brand";

function StepRow({ steps, offset }: { steps: typeof PROCESS_STEPS; offset: number }) {
  return (
    <div className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
      {/* dashed line joining the steps */}
      <div aria-hidden className="absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-white/30 sm:block" />
      {steps.map((step, i) => (
        <RevealOnScroll key={step.title} delay={i * 0.08} className="relative flex flex-col items-center text-center">
          <div className="relative grid h-[72px] w-[72px] place-items-center rounded-full bg-white/95 text-brand-forest shadow-lg">
            <BrandIcon name={step.icon} size={28} />
            <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-brand-gold text-xs font-bold text-white">
              {offset + i + 1}
            </span>
          </div>
          <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
          <p className="mt-1 max-w-[220px] text-sm text-white/75">{step.body}</p>
        </RevealOnScroll>
      ))}
    </div>
  );
}

// Home page part 2: how the powder is made (8 steps from the PPT).
export default function ProcessSection() {
  return (
    <section className="container-site py-16 lg:py-20">
      <div className="glass-green relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-10 lg:py-16">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf-light">How we make it</p>
          <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] text-white">
            From the farm to your pouch
          </h2>
          <p className="mt-3 text-white/75">
            Eight simple, hygienic steps. Only drying — that is why no preservatives are needed.
          </p>
        </RevealOnScroll>

        <div className="mt-12 flex flex-col gap-12">
          <StepRow steps={PROCESS_STEPS.slice(0, 4)} offset={0} />
          <StepRow steps={PROCESS_STEPS.slice(4)} offset={4} />
        </div>

        <RevealOnScroll className="mt-12 grid grid-cols-1 items-center gap-6 rounded-2xl bg-white/10 p-5 sm:grid-cols-[auto_1fr]">
          <div className="relative mx-auto h-28 w-48 overflow-hidden rounded-xl bg-white/90 sm:mx-0">
            <Image src="/images/products/ginger-garlic-photo-wide.jpg" alt="Fresh ginger and garlic with ginger garlic powder" fill sizes="192px" className="object-cover" />
          </div>
          <p className="text-center text-white sm:text-left">
            <span className="font-serif text-xl">The result:</span>{" "}
            <span className="text-white/85">100% pure natural powder with no preservatives and no additives.</span>
          </p>
        </RevealOnScroll>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TRUST_BADGES.map((b) => (
            <span key={b} className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

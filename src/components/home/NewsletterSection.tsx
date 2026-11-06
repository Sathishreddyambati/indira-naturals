"use client";

import { useState } from "react";
import { toast } from "sonner";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success("You're subscribed! Welcome to Indira Naturals.");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-10">
      <div className="container-site">
        <RevealOnScroll className="glass mx-auto max-w-3xl rounded-[2rem] px-6 py-10 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-leaf">Stay Fresh</p>
          <h2 className="mt-2 font-serif text-[clamp(1.5rem,3vw,2.25rem)] text-brand-forest">
            Join our newsletter for offers &amp; new launches
          </h2>
          <p className="mt-3 text-brand-charcoal/70">
            Occasional updates on new products, recipes, and promotions. No spam, unsubscribe anytime.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full flex-1 rounded-full border border-brand-brown/30 bg-white px-5 py-3 text-sm outline-none focus:border-brand-forest"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-brand-forest px-7 py-3 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-leaf disabled:opacity-60"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </RevealOnScroll>
      </div>
    </section>
  );
}

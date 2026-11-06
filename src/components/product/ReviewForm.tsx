"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, customerName: name, title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review");
      setSubmitted(true);
      toast.success("Thank you! Your review has been submitted for moderation.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="rounded-xl bg-brand-leaf/10 p-4 text-sm text-brand-forest">
        Thanks for sharing your experience! Your review is pending approval and will appear once
        moderated by our team.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-brand-brown/15 p-5">
      <h3 className="font-serif text-lg text-brand-forest">Write a Review</h3>
      <div className="flex items-center gap-2">
        <label htmlFor="rating" className="text-sm font-medium">Rating</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-lg border border-brand-brown/30 px-2 py-1 text-sm"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>
      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-brand-brown/30 px-3 py-2 text-sm outline-none focus:border-brand-forest"
      />
      <input
        placeholder="Review title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border border-brand-brown/30 px-3 py-2 text-sm outline-none focus:border-brand-forest"
      />
      <textarea
        required
        placeholder="Share your experience with this product..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="rounded-lg border border-brand-brown/30 px-3 py-2 text-sm outline-none focus:border-brand-forest"
      />
      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-full bg-brand-forest px-6 py-2.5 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

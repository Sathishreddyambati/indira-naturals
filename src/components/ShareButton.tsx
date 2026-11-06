"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton({ title }: { title: string }) {
  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled share — no action needed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-sm font-medium text-brand-charcoal/70 hover:text-brand-forest"
    >
      <Share2 size={16} /> Share
    </button>
  );
}

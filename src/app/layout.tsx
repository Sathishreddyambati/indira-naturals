import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Indira Naturals | Pure Ingredients. Naturally Better.",
    template: "%s | Indira Naturals",
  },
  description:
    "Indira Naturals makes 100% pure ginger, garlic and ginger garlic powders — made only by drying, with no preservatives and no additives. Pure • Fresh • Natural.",
  keywords: [
    "Indira Naturals",
    "ginger garlic powder",
    "garlic powder",
    "ginger powder",
    "no preservatives",
    "natural ingredient powders",
    "Guntur",
  ],
  openGraph: {
    title: "Indira Naturals | Pure Ingredients. Naturally Better.",
    description:
      "Ginger and garlic, ready when you are. 100% pure natural powders with nothing added.",
    url: siteUrl,
    siteName: "Indira Naturals",
    images: ["/images/products/all-variants.jpg"],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indira Naturals | Pure Ingredients. Naturally Better.",
    description:
      "Ginger and garlic, ready when you are. 100% pure natural powders with nothing added.",
    images: ["/images/products/all-variants.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans text-brand-charcoal antialiased">
        <CartProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#174D2A",
                color: "#FAF7EF",
                border: "none",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { SiteSettingsDTO } from "@/db/queries";
import { CONTACT, TAGLINE } from "@/lib/brand";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3V3Z" />
    </svg>
  );
}

export default function Footer({ settings }: { settings: SiteSettingsDTO }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-20">
      <div className="glass block-sand border-x-0 border-b-0">
        <div className="container-site grid grid-cols-1 gap-10 pb-6 pt-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/images/logo-sm.png"
              alt="Indira Naturals"
              width={560}
              height={315}
              className="logo-glow h-20 w-auto object-contain"
            />
            <p className="mt-4 max-w-xs text-sm text-brand-charcoal/75">
              100% pure ginger, garlic, onion and tomato powders, made only by drying. No preservatives, no additives.
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-forest">{TAGLINE}</p>
            <div className="mt-4 flex items-center gap-3">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Indira Naturals on Instagram"
                  className="grid h-9 w-9 place-items-center rounded-full bg-brand-forest/10 text-brand-forest hover:bg-brand-forest/20"
                >
                  <InstagramIcon />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Indira Naturals on Facebook"
                  className="grid h-9 w-9 place-items-center rounded-full bg-brand-forest/10 text-brand-forest hover:bg-brand-forest/20"
                >
                  <FacebookIcon />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg text-brand-forest">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-charcoal/80">
              <li><Link href="/product/ginger-powder" className="hover:text-brand-forest">Ginger Powder</Link></li>
              <li><Link href="/product/garlic-powder" className="hover:text-brand-forest">Garlic Powder</Link></li>
              <li><Link href="/product/garlic-ginger-powder" className="hover:text-brand-forest">Ginger Garlic Powder</Link></li>
              <li><Link href="/product/onion-powder" className="hover:text-brand-forest">Onion Powder</Link></li>
              <li><Link href="/product/tomato-powder" className="hover:text-brand-forest">Tomato Powder</Link></li>
              <li><Link href="/shop" className="hover:text-brand-forest">Shop All</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-brand-forest">Information</h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-charcoal/80">
              <li><Link href="/why-us" className="hover:text-brand-forest">Why Us</Link></li>
              <li><Link href="/our-story" className="hover:text-brand-forest">About Us</Link></li>
              <li><Link href="/track-order" className="hover:text-brand-forest">Track Your Order</Link></li>
              <li><Link href="/policies/shipping-returns" className="hover:text-brand-forest">Shipping &amp; Returns</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-brand-forest">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-brand-forest">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-brand-forest">Need Help?</h3>
            <ul className="mt-4 space-y-3 text-sm text-brand-charcoal/80">
              {CONTACT.phones.map((p) => (
                <li key={p.tel} className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0 text-brand-leaf" />
                  <a href={`tel:${p.tel}`} className="hover:text-brand-forest">{p.display}</a>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0 text-brand-leaf" />
                <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-brand-forest">{CONTACT.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-brand-leaf" />
                <span>{CONTACT.address}</span>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="rounded-full bg-brand-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-leaf"
              >
                Contact Us
              </Link>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom border theme (village art), shown at the end of every page */}
        <div aria-hidden className="theme-fade-top relative h-[clamp(70px,9vw,150px)] w-full overflow-hidden">
          <Image src="/images/theme/bottom.jpg" alt="" fill sizes="100vw" className="object-cover object-bottom" />
        </div>
      </div>

      <div className="bg-brand-forest py-4">
        <div className="container-site flex flex-col items-center justify-between gap-1 text-xs text-brand-ivory/75 sm:flex-row">
          <p>© {year} Indira Naturals. All rights reserved.</p>
          <p>{TAGLINE}</p>
        </div>
      </div>
    </footer>
  );
}

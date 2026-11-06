import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { Accordion } from "@/components/Accordion";
import { CONTACT } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Got a question? Get in touch with Indira Naturals by phone, email or WhatsApp.",
  alternates: { canonical: "/contact" },
};

const FAQS = [
  { question: "How can I track my order?", answer: "Visit the Track Order page and enter your order number along with the email used at checkout." },
  { question: "What payment methods do you accept?", answer: "We support secure online payments via UPI, cards, and net banking, plus Cash on Delivery where enabled." },
  { question: "How long does the powder last?", answer: "Best before 12 months from the date of manufacturing. Keep it in a cool, dry place and always use a dry spoon." },
  { question: "Do you take bulk orders?", answer: "Yes. Call or WhatsApp us with the quantity you need and we will get back to you." },
];

export default function ContactPage() {
  return (
    <div className="container-site pb-12 pt-4 lg:pb-16">
      <div className="text-center">
        <h1 className="font-serif text-[clamp(2.2rem,4.5vw,3.5rem)] text-brand-forest">Got a question?</h1>
        <p className="mt-2 text-xl text-brand-charcoal/75">Get in touch</p>
      </div>

      {/* Number, email, address */}
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="glass flex flex-col items-center rounded-2xl p-6 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-forest text-white">
            <Phone size={20} />
          </div>
          <h2 className="mt-3 font-serif text-lg text-brand-forest">Phone</h2>
          {CONTACT.phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="mt-1 text-brand-charcoal hover:underline">
              {p.display}
            </a>
          ))}
        </div>
        <div className="glass flex flex-col items-center rounded-2xl p-6 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-forest text-white">
            <Mail size={20} />
          </div>
          <h2 className="mt-3 font-serif text-lg text-brand-forest">Email</h2>
          <a href={`mailto:${CONTACT.email}`} className="mt-1 break-all text-brand-charcoal hover:underline">
            {CONTACT.email}
          </a>
        </div>
        <div className="glass flex flex-col items-center rounded-2xl p-6 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-forest text-white">
            <MapPin size={20} />
          </div>
          <h2 className="mt-3 font-serif text-lg text-brand-forest">Address</h2>
          <p className="mt-1 text-brand-charcoal">{CONTACT.address}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </a>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-serif text-xl text-brand-forest">Send Us a Message</h2>
          <ContactForm />
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-serif text-xl text-brand-forest">Frequently Asked Questions</h2>
          <Accordion items={FAQS} />
        </div>
      </div>
    </div>
  );
}

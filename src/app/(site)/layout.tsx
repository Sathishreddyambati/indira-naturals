import type { ReactNode } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import IntroSplash from "@/components/IntroSplash";
import ThemeTop from "@/components/ThemeTop";
import { getSiteSettings } from "@/db/queries";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <div className="relative flex min-h-screen flex-col">
      <IntroSplash />

      {/* Logo watermark fixed behind the page while scrolling */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[url('/images/logo-sm.png')] bg-[length:min(70vw,760px)_auto] bg-center bg-no-repeat opacity-[0.07]"
      />

      <AnnouncementBar text={settings.announcementText} />
      <Navbar />
      <ThemeTop />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
    </div>
  );
}

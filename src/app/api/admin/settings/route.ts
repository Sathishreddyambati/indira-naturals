import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { adminSettingsSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { getSiteSettings } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, response } = await requireAdmin();
  if (!session) return response;
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const { session, response } = await requireAdmin();
  if (!session) return response;

  const json = await req.json().catch(() => null);
  const parsed = adminSettingsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid settings" }, { status: 400 });
  }
  const input = parsed.data;

  await db
    .update(siteSettings)
    .set({
      announcementText: input.announcementText,
      heroHeadline: input.heroHeadline,
      heroSubtext: input.heroSubtext,
      heroCtaPrimaryLabel: input.heroCtaPrimaryLabel,
      heroCtaSecondaryLabel: input.heroCtaSecondaryLabel,
      freeShippingThreshold: input.freeShippingThreshold.toFixed(2),
      flatShippingRate: input.flatShippingRate.toFixed(2),
      codEnabled: input.codEnabled,
      onlinePaymentEnabled: input.onlinePaymentEnabled,
      supportEmail: input.supportEmail,
      supportPhone: input.supportPhone,
      whatsappNumber: input.whatsappNumber,
      businessAddress: input.businessAddress,
      instagramUrl: input.instagramUrl || null,
      facebookUrl: input.facebookUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, 1));

  return NextResponse.json({ ok: true });
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/money";
import { checkoutSchema } from "@/lib/validation";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Props = {
  codEnabled: boolean;
  razorpayEnabled: boolean;
  freeShippingThreshold: number;
  flatShippingRate: number;
  brandName: string;
};

type FormState = {
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions: string;
};

const initialState: FormState = {
  customerName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  deliveryInstructions: "",
};

export default function CheckoutForm({
  codEnabled,
  razorpayEnabled,
  freeShippingThreshold,
  flatShippingRate,
  brandName,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lines, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(initialState);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">(
    razorpayEnabled ? "razorpay" : "cod",
  );
  const [couponCode, setCouponCode] = useState(searchParams.get("coupon") ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const estimatedShipping = subtotal >= freeShippingThreshold ? 0 : flatShippingRate;
  const estimatedTotal = subtotal + estimatedShipping;

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const itemsPayload = useMemo(
    () => lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
    [lines],
  );

  async function submitOrder(method: "cod" | "razorpay") {
    const payload = {
      ...form,
      addressLine2: form.addressLine2 || "",
      deliveryInstructions: form.deliveryInstructions || "",
      paymentMethod: method,
      couponCode: couponCode || "",
      items: itemsPayload,
    };

    const validation = checkoutSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order");

      if (data.paymentMethod === "cod") {
        sessionStorage.setItem(
          "indira_last_order",
          JSON.stringify({ orderNumber: data.orderNumber, total: data.total, paymentMethod: "cod", items: lines }),
        );
        clearCart();
        router.push(`/checkout/success?order=${data.orderNumber}`);
        return;
      }

      // Razorpay flow
      if (!window.Razorpay) {
        toast.error("Payment gateway failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: Math.round(data.total * 100),
        currency: "INR",
        name: brandName,
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: form.customerName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#174D2A" },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderNumber: data.orderNumber, ...response }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            sessionStorage.setItem(
              "indira_last_order",
              JSON.stringify({ orderNumber: data.orderNumber, total: data.total, paymentMethod: "razorpay", items: lines }),
            );
            clearCart();
            router.push(`/checkout/success?order=${data.orderNumber}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed");
          }
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled. Your order has not been charged.");
          },
        },
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitOrder(paymentMethod);
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-brand-brown/10 bg-white p-6">
            <h2 className="mb-4 font-serif text-xl text-brand-forest">Contact &amp; Shipping Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" error={errors.customerName}>
                <input value={form.customerName} onChange={(e) => updateField("customerName", e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Email Address" error={errors.email}>
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Mobile Number" error={errors.phone}>
                <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="10-digit mobile number" className={inputClass} required />
              </Field>
              <Field label="PIN Code" error={errors.pincode}>
                <input value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Address Line 1" error={errors.addressLine1} full>
                <input value={form.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Address Line 2 (optional)" full>
                <input value={form.addressLine2} onChange={(e) => updateField("addressLine2", e.target.value)} className={inputClass} />
              </Field>
              <Field label="City" error={errors.city}>
                <input value={form.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} required />
              </Field>
              <Field label="State" error={errors.state}>
                <input value={form.state} onChange={(e) => updateField("state", e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Delivery Instructions (optional)" full>
                <textarea value={form.deliveryInstructions} onChange={(e) => updateField("deliveryInstructions", e.target.value)} rows={2} className={inputClass} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-brand-brown/10 bg-white p-6">
            <h2 className="mb-4 font-serif text-xl text-brand-forest">Payment Method</h2>
            <div className="flex flex-col gap-3">
              {razorpayEnabled && (
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === "razorpay" ? "border-brand-forest bg-brand-leaf/5" : "border-brand-brown/20"}`}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} className="accent-brand-forest" />
                  <div>
                    <p className="font-medium">Pay Online (UPI / Card / Netbanking)</p>
                    <p className="text-xs text-brand-charcoal/60">Secure checkout powered by Razorpay</p>
                  </div>
                </label>
              )}
              {codEnabled && (
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === "cod" ? "border-brand-forest bg-brand-leaf/5" : "border-brand-brown/20"}`}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-brand-forest" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-xs text-brand-charcoal/60">Pay in cash when your order arrives</p>
                  </div>
                </label>
              )}
              {!razorpayEnabled && !codEnabled && (
                <p className="text-sm text-red-600">No payment methods are currently available. Please contact support.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-brand-brown/10 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-serif text-xl text-brand-forest">Order Summary</h2>
          <ul className="mb-4 flex max-h-64 flex-col gap-3 overflow-y-auto">
            {lines.map((line) => (
              <li key={line.variantId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-brand-cream">
                  <Image src={line.image} alt={line.name} fill sizes="56px" className="object-contain" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{line.name}</p>
                  <p className="text-xs text-brand-charcoal/60">{line.variantLabel} × {line.quantity}</p>
                </div>
                <span className="text-sm font-semibold">{formatINR(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Discount code"
              className="flex-1 rounded-full border border-brand-brown/30 px-4 py-2 text-sm outline-none focus:border-brand-forest"
            />
          </div>

          <div className="flex flex-col gap-2 border-t border-brand-brown/10 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-brand-charcoal/70">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-brand-charcoal/70">Estimated Shipping</span><span>{estimatedShipping === 0 ? "Free" : formatINR(estimatedShipping)}</span></div>
            <div className="flex justify-between border-t border-brand-brown/10 pt-2 font-serif text-lg font-semibold"><span>Estimated Total</span><span>{formatINR(estimatedTotal)}</span></div>
          </div>
          <p className="mt-2 text-xs text-brand-charcoal/50">
            Final total including any discount is calculated securely on our server.
          </p>

          <button
            type="submit"
            disabled={loading || lines.length === 0 || (!razorpayEnabled && !codEnabled)}
            className="mt-5 w-full rounded-full bg-brand-forest px-6 py-3.5 text-sm font-semibold text-brand-ivory transition-colors hover:bg-brand-leaf disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Placing Order..." : paymentMethod === "cod" ? "Place Order (COD)" : "Pay Securely"}
          </button>
        </aside>
      </form>
    </>
  );
}

const inputClass =
  "w-full rounded-lg border border-brand-brown/30 px-3.5 py-2.5 text-sm outline-none focus:border-brand-forest";

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-charcoal/60">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

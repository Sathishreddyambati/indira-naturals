"use client";

import { useState } from "react";
import Image from "next/image";
import { formatINR } from "@/lib/money";

type TrackedOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  trackingNumber: string | null;
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
  createdAt: string;
  items: { productName: string; variantLabel: string; quantity: number; lineTotal: string; productImage: string }[];
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const activeStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="container-site py-12 lg:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-brand-forest">Track Your Order</h1>
        <p className="mt-3 text-brand-charcoal/70">
          Enter your order number and the email address used at checkout to view the latest status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
        <input
          required
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
          placeholder="Order Number (e.g. IN-20260101-1234)"
          className="flex-1 rounded-full border border-brand-brown/30 px-5 py-3 text-sm outline-none focus:border-brand-forest"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email used at checkout"
          className="flex-1 rounded-full border border-brand-brown/30 px-5 py-3 text-sm outline-none focus:border-brand-forest"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand-forest px-7 py-3 text-sm font-semibold text-brand-ivory hover:bg-brand-leaf disabled:opacity-60"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && <p className="mx-auto mt-4 max-w-xl text-center text-sm text-red-600">{error}</p>}

      {order && (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-brand-brown/10 bg-brand-sand-light p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-brown/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-charcoal/50">Order</p>
              <p className="font-serif text-xl text-brand-forest">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-brand-charcoal/50">Payment</p>
              <p className="font-medium capitalize">{order.paymentStatus} · {order.paymentMethod === "cod" ? "COD" : "Online"}</p>
            </div>
          </div>

          {order.status === "cancelled" ? (
            <p className="py-6 text-center font-medium text-red-600">This order has been cancelled.</p>
          ) : (
            <div className="flex items-center justify-between py-6">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                      i <= activeStepIndex ? "bg-brand-forest text-brand-ivory" : "bg-brand-sand text-brand-charcoal/40"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p className="mt-2 text-[11px] capitalize text-brand-charcoal/60">{step}</p>
                </div>
              ))}
            </div>
          )}

          {order.trackingNumber && (
            <p className="mb-4 rounded-lg bg-brand-sand p-3 text-sm">
              Tracking Number: <span className="font-semibold">{order.trackingNumber}</span>
            </p>
          )}

          <ul className="flex flex-col gap-3 border-t border-brand-brown/10 pt-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-brand-sand">
                  <Image src={item.productImage} alt={item.productName} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-xs text-brand-charcoal/60">{item.variantLabel} × {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold">{formatINR(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between border-t border-brand-brown/10 pt-4 font-serif text-lg font-semibold">
            <span>Total</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

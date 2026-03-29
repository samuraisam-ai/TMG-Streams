"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { seedTitles } from "@/constants/seed-data";
import { supabaseBrowser } from "@/lib/supabase";

const formatPrice = (amountInCents: number) => `R${(amountInCents / 100).toFixed(2)}`;

export default function CheckoutPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const title = useMemo(() => seedTitles.find((item) => item.slug === slug), [slug]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMockPayment, setShowMockPayment] = useState(false);
  const [pendingPurchaseId, setPendingPurchaseId] = useState<string | null>(null);

  if (!title) {
    return (
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-4xl border border-border bg-surface p-6">
          <p className="text-lg">Title not found</p>
        </div>
      </section>
    );
  }

  const handleBuyNow = async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabaseBrowser.auth.getUser();

    if (userError || !user) {
      window.location.href = "/auth";
      return;
    }

    const { data: existingPurchase } = await supabaseBrowser
      .from("purchases")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("title_id", title.id)
      .maybeSingle();

    if (existingPurchase) {
      if (existingPurchase.status === "complete") {
        window.location.href = `/watch/${slug}`;
        return;
      }
      setPendingPurchaseId(String(existingPurchase.id));
      setShowMockPayment(true);
      setLoading(false);
      return;
    }

    const { data: purchase, error: insertError } = await supabaseBrowser
      .from("purchases")
      .insert({
        user_id: user.id,
        title_id: title.id,
        amount: title.price,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !purchase?.id) {
      setError(insertError?.message ?? "Unable to initialize payment");
      setLoading(false);
      return;
    }

    setPendingPurchaseId(String(purchase.id));
    setShowMockPayment(true);
    setLoading(false);
  };

  const handleMockComplete = async () => {
    if (!pendingPurchaseId) {
      setError("Unable to finalize payment");
      return;
    }

    setLoading(true);
    setError("");

    const { error: completeError } = await supabaseBrowser
      .from("purchases")
      .update({ status: "complete" })
      .eq("id", pendingPurchaseId);

    if (completeError) {
      setError(completeError.message);
      setLoading(false);
      return;
    }

    window.location.href = `/confirmation?title=${slug}`;
  };

  if (showMockPayment) {
    return (
      <section className="flex min-h-[calc(100vh-130px)] items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
        <div className="w-full max-w-[480px] border border-border bg-surface p-6 text-center sm:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">PAYMENT PROCESSING</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight">Almost there.</h1>
          <p className="mt-4 text-sm text-text-secondary">
            This is where PayFast handles your secure payment. Our merchant account is currently being verified.
            Click below to simulate a completed payment and continue.
          </p>

          <button
            type="button"
            onClick={handleMockComplete}
            disabled={loading}
            className="mt-7 w-full border border-white bg-white px-4 py-4 text-sm font-medium text-black disabled:opacity-70"
          >
            {loading ? "Processing..." : "Skyf Money 💸"}
          </button>

          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

          <p className="mt-5 text-xs text-text-secondary">Secured payment powered by PayFast - coming soon</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-[1100px] gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="border border-border bg-surface p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">YOUR ORDER</p>

          <div className="mt-4 aspect-[2/3] w-full border border-border bg-bg">
            <img
              src={title.poster_url}
              alt={title.title}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="mt-5 font-serif text-4xl leading-tight">{title.title}</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-text-secondary">
            {title.type.toUpperCase()}
          </p>

          <p className="mt-4 line-clamp-2 text-sm text-text-secondary">{title.synopsis}</p>

          <p className="mt-4 text-sm text-text-secondary">Short film · Full access</p>
        </div>

        <div className="border border-border bg-surface p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">COMPLETE PURCHASE</p>

          <p className="mt-4 font-serif text-5xl leading-none">{formatPrice(title.price)}</p>
          <p className="mt-2 text-sm text-text-secondary">One-time payment · Lifetime access</p>

          <div className="my-6 border-t border-border" />

          <h2 className="text-xs uppercase tracking-[0.25em] text-text-secondary">WHAT YOU GET</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-secondary">
            <li>Instant access after payment</li>
            <li>Watch on any device</li>
            <li>Your purchase is saved to your library</li>
          </ul>

          <div className="my-6 border-t border-border" />

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={loading}
            className="w-full border border-accent bg-accent px-4 py-4 text-sm font-medium text-bg disabled:opacity-70"
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>

          <p className="mt-3 text-xs text-text-secondary">
            You will continue to a mock payment screen for testing.
          </p>

          <button
            type="button"
            className="mt-4 w-full border border-border bg-transparent px-4 py-4 text-sm text-text-secondary"
          >
            Pay with Card (International)
          </button>

          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

          <p className="mt-6 text-xs text-text-secondary">Secured by PayFast · 256-bit SSL</p>
        </div>
      </div>
    </section>
  );
}
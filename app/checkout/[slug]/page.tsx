"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { seedEpisodes, seedTitles } from "@/constants/seed-data";
import { supabaseBrowser } from "@/lib/supabase";

const formatPrice = (amountInCents: number) => `R${(amountInCents / 100).toFixed(2)}`;
const PAYFAST_URL = "https://www.payfast.co.za/eng/process";

export default function CheckoutPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const title = useMemo(() => seedTitles.find((item) => item.slug === slug), [slug]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildPayFastForm = (
    selectedTitle: (typeof seedTitles)[number],
    user: { email?: string | null },
    purchaseId: string,
  ) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const email = user.email ?? "";
    const nameFirst = email ? (email.split("@")[0]?.split(/[^a-zA-Z0-9]+/)[0] ?? "Customer") : "Customer";

    return {
      merchant_id: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID ?? "",
      merchant_key: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY ?? "",
      return_url: `${siteUrl}/confirmation?title=${slug}`,
      cancel_url: `${siteUrl}/checkout/${slug}`,
      notify_url: `${siteUrl}/api/payfast/notify`,
      name_first: nameFirst || "Customer",
      email_address: email,
      m_payment_id: purchaseId,
      amount: (selectedTitle.price / 100).toFixed(2),
      item_name: `${selectedTitle.title} - TMG Streams`,
      item_description: `${selectedTitle.type} - ${selectedTitle.synopsis.slice(0, 100)}`,
    };
  };

  if (!title) {
    return (
      <section className="px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-4xl border border-border bg-surface p-6">
          <p className="text-lg">Title not found</p>
        </div>
      </section>
    );
  }

  const episodeCount = seedEpisodes.filter((episode) => episode.title_id === title.id).length;

  const handlePayFast = async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabaseBrowser.auth.getUser();

    if (userError) {
      setError(userError.message);
      setLoading(false);
      return;
    }

    if (!user) {
      window.location.href = "/auth";
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

    const payFastData = buildPayFastForm(title, user, String(purchase.id));
    const form = document.createElement("form");
    form.method = "POST";
    form.action = PAYFAST_URL;
    form.style.display = "none";

    Object.entries(payFastData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <section className="px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-[1100px] gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="border border-border bg-surface p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">YOUR ORDER</p>

          <div className="mt-4 aspect-[2/3] w-full border border-border bg-bg" />

          <h1 className="mt-5 font-serif text-4xl leading-tight">{title.title}</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-text-secondary">
            {title.type.toUpperCase()}
          </p>

          <p className="mt-4 line-clamp-2 text-sm text-text-secondary">{title.synopsis}</p>

          {title.type === "series" && (
            <p className="mt-4 text-sm text-text-secondary">
              {episodeCount} Episodes · Full Season Access
            </p>
          )}
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
            onClick={handlePayFast}
            disabled={loading}
            className="w-full border border-accent bg-accent px-4 py-4 text-sm font-medium text-bg disabled:opacity-70"
          >
            {loading ? "Processing..." : "Pay with PayFast"}
          </button>

          <p className="mt-3 text-xs text-text-secondary">
            You will be redirected to PayFast to complete your payment securely.
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
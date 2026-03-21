"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { seedTitles } from "@/constants/seed-data";

const formatPrice = (amountInCents: number) => `R${(amountInCents / 100).toFixed(2)}`;

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("title");

  const title = useMemo(() => seedTitles.find((item) => item.slug === slug), [slug]);

  return (
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-12 sm:px-10">
      <div className="w-full max-w-xl border border-border bg-surface p-8 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-border text-3xl">
          ✓
        </div>

        <h1 className="mt-6 font-serif text-5xl leading-tight">Purchase Complete</h1>
        <p className="mt-3 text-sm text-text-secondary">
          You now have full access to {title?.title ?? "your title"}
        </p>

        {title && (
          <div className="mt-6 border border-border bg-bg p-5 text-left">
            <p className="font-serif text-2xl">{title.title}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-text-secondary">
              {title.type.toUpperCase()}
            </p>
            <p className="mt-3 text-sm text-text-secondary">Price paid</p>
            <p className="text-xl text-text">{formatPrice(title.price)}</p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Link
            href="/library"
            className="block w-full border border-accent bg-accent px-4 py-4 text-sm font-medium text-bg"
          >
            Go to My Library
          </Link>
          <Link
            href="/"
            className="block w-full border border-border bg-transparent px-4 py-4 text-sm text-text-secondary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-text-secondary">Loading...</p>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
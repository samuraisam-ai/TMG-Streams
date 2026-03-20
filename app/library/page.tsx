"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { seedTitles } from "@/constants/seed-data";
import { supabaseBrowser } from "@/lib/supabase";
import type { Title } from "@/types";

interface PurchaseRow {
  id: string;
  title_id: string;
  status: string;
  created_at: string;
}

export default function LibraryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Viewer");
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);

  useEffect(() => {
    const loadLibrary = async () => {
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

      const { data: profileData } = await supabaseBrowser
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData?.full_name) {
        setUserName(profileData.full_name);
      }

      const { data: purchaseData, error: purchasesError } = await supabaseBrowser
        .from("purchases")
        .select("id, title_id, status, created_at")
        .eq("user_id", user.id)
        .in("status", ["pending", "complete"])
        .order("created_at", { ascending: false });

      if (purchasesError) {
        setError(purchasesError.message);
        setLoading(false);
        return;
      }

      setPurchases((purchaseData as PurchaseRow[] | null) ?? []);
      setLoading(false);
    };

    loadLibrary();
  }, []);

  const titleById = useMemo(() => {
    return new Map(seedTitles.map((title) => [title.id, title]));
  }, []);

  const purchasedTitles = useMemo(() => {
    const mapped = purchases
      .map((purchase) => {
        const title = titleById.get(purchase.title_id);
        return title ? { purchase, title } : null;
      })
      .filter((item): item is { purchase: PurchaseRow; title: Title } => Boolean(item));

    const unique = new Map<string, { purchase: PurchaseRow; title: Title }>();
    mapped.forEach((item) => {
      if (!unique.has(item.title.id)) {
        unique.set(item.title.id, item);
      }
    });

    return Array.from(unique.values());
  }, [purchases, titleById]);

  const latest = purchasedTitles[0];

  if (loading) {
    return (
      <section className="px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-6xl border border-border bg-surface p-6">
          <p className="text-sm text-text-secondary">Loading your library...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="font-serif text-4xl sm:text-5xl">Welcome back, {userName}</h1>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {!error && purchasedTitles.length === 0 && (
          <div className="mt-8 border border-border bg-surface p-6">
            <p className="text-sm text-text-secondary">
              Your library is empty. Browse our catalogue to get started.
            </p>
            <Link href="/#titles" className="mt-4 inline-block border border-accent bg-accent px-4 py-2 text-sm text-bg">
              Browse Titles
            </Link>
          </div>
        )}

        {!error && purchasedTitles.length > 0 && (
          <>
            {latest && (
              <div className="mt-8 border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">RECENTLY ADDED</p>
                <Link href={`/watch/${latest.title.slug}`} className="mt-4 block">
                  <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
                    <div className="aspect-[2/3] border border-border bg-bg" />
                    <div className="self-center">
                      <p className="font-serif text-3xl">{latest.title.title}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                        {latest.title.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className="mt-10">
              <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">ALL TITLES</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {purchasedTitles.map(({ title }) => (
                  <Link
                    key={title.id}
                    href={`/watch/${title.slug}`}
                    className="border border-border bg-surface p-4 transition duration-200 hover:border-white hover:scale-[1.02]"
                  >
                    <div className="aspect-[2/3] border border-border bg-bg" />
                    <p className="mt-3 font-serif text-2xl">{title.title}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                      {title.type.toUpperCase()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
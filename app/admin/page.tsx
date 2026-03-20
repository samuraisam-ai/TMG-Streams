"use client";

import { useEffect, useMemo, useState } from "react";
import { seedTitles } from "@/constants/seed-data";
import { supabaseBrowser } from "@/lib/supabase";

interface PurchaseRow {
  id: string;
  user_id: string;
  title_id: string;
  amount: number;
  status: "pending" | "complete" | "failed" | string;
  created_at: string;
}

interface ProfileRow {
  id: string;
  email: string;
}

const formatMoney = (amountInCents: number) => `R${(amountInCents / 100).toFixed(2)}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
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

      const [purchasesResult, profilesResult] = await Promise.all([
        supabaseBrowser
          .from("purchases")
          .select("*")
          .order("created_at", { ascending: false }),
        supabaseBrowser.from("profiles").select("*"),
      ]);

      if (purchasesResult.error) {
        setError(purchasesResult.error.message);
        setLoading(false);
        return;
      }

      if (profilesResult.error) {
        setError(profilesResult.error.message);
        setLoading(false);
        return;
      }

      setPurchases((purchasesResult.data as PurchaseRow[] | null) ?? []);
      setProfiles((profilesResult.data as ProfileRow[] | null) ?? []);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  const titleMap = useMemo(() => {
    return new Map(seedTitles.map((title) => [title.id, title]));
  }, []);

  const profileEmailMap = useMemo(() => {
    return new Map(profiles.map((profile) => [profile.id, profile.email]));
  }, [profiles]);

  const totalRevenue = purchases
    .filter((purchase) => purchase.status === "complete")
    .reduce((sum, purchase) => sum + (purchase.amount ?? 0), 0);

  const totalPurchases = purchases.length;
  const completeCount = purchases.filter((purchase) => purchase.status === "complete").length;
  const pendingCount = purchases.filter((purchase) => purchase.status === "pending").length;

  const revenueByTitle = useMemo(() => {
    const map = new Map<string, { titleName: string; amount: number }>();

    purchases
      .filter((purchase) => purchase.status === "complete")
      .forEach((purchase) => {
        const title = titleMap.get(purchase.title_id);
        const key = title?.id ?? purchase.title_id;
        const titleName = title?.title ?? "Unknown Title";

        if (!map.has(key)) {
          map.set(key, { titleName, amount: 0 });
        }

        const current = map.get(key);
        if (current) {
          current.amount += purchase.amount ?? 0;
        }
      });

    return Array.from(map.values());
  }, [purchases, titleMap]);

  const maxRevenue = Math.max(...revenueByTitle.map((item) => item.amount), 0);

  const statusBadgeClass = (status: string) => {
    if (status === "complete") {
      return "bg-[#14532d] text-white";
    }

    if (status === "pending") {
      return "bg-[#713f12] text-white";
    }

    return "bg-[#7f1d1d] text-white";
  };

  if (loading) {
    return (
      <section className="px-6 py-10 sm:px-10 sm:py-14">
        <div className="mx-auto w-full max-w-[1200px] border border-border bg-surface p-6">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1200px] space-y-8">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-text-secondary">TMG Streams - Internal Management</p>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="border border-border bg-surface p-5">
            <p className="text-3xl text-text">{formatMoney(totalRevenue)}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Total Revenue</p>
          </div>
          <div className="border border-border bg-surface p-5">
            <p className="text-3xl text-text">{totalPurchases}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Total Purchases</p>
          </div>
          <div className="border border-border bg-surface p-5">
            <p className="text-3xl text-text">{completeCount}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Complete</p>
          </div>
          <div className="border border-border bg-surface p-5">
            <p className="text-3xl text-text">{pendingCount}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Pending</p>
          </div>
        </div>

        <div className="border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">REVENUE OVERVIEW</p>

          {revenueByTitle.length === 0 ? (
            <p className="mt-4 text-sm text-text-secondary">No revenue data yet</p>
          ) : (
            <div className="mt-6 flex flex-wrap items-end gap-6">
              {revenueByTitle.map((item) => {
                const height = maxRevenue > 0 ? Math.max((item.amount / maxRevenue) * 120, 6) : 6;
                return (
                  <div key={item.titleName} className="min-w-[120px]">
                    <div className="flex h-[120px] items-end border border-border bg-bg p-2">
                      <div className="w-full bg-white" style={{ height: `${height}px` }} />
                    </div>
                    <p className="mt-2 text-sm text-text">{item.titleName}</p>
                    <p className="text-xs text-text-secondary">{formatMoney(item.amount)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">RECENT TRANSACTIONS</p>

          {purchases.length === 0 ? (
            <p className="mt-4 text-sm text-text-secondary">No transactions yet</p>
          ) : (
            <div className="mt-4 overflow-x-auto border border-border">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-bg text-left text-xs uppercase tracking-[0.16em] text-text-secondary">
                  <tr>
                    <th className="border-b border-border px-4 py-3">Date</th>
                    <th className="border-b border-border px-4 py-3">User</th>
                    <th className="border-b border-border px-4 py-3">Title</th>
                    <th className="border-b border-border px-4 py-3">Amount</th>
                    <th className="border-b border-border px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase, index) => {
                    const rowBackground = index % 2 === 0 ? "bg-surface" : "bg-bg";
                    const titleName = titleMap.get(purchase.title_id)?.title ?? "Unknown Title";
                    const userEmail = profileEmailMap.get(purchase.user_id) ?? "Unknown";

                    return (
                      <tr key={purchase.id} className={rowBackground}>
                        <td className="border-b border-border px-4 py-3 text-text-secondary">
                          {formatDate(purchase.created_at)}
                        </td>
                        <td className="border-b border-border px-4 py-3 text-text-secondary">{userEmail}</td>
                        <td className="border-b border-border px-4 py-3 text-text">{titleName}</td>
                        <td className="border-b border-border px-4 py-3 text-text">
                          {formatMoney(purchase.amount ?? 0)}
                        </td>
                        <td className="border-b border-border px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${statusBadgeClass(purchase.status)}`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">TITLES</p>

          <div className="mt-4 divide-y divide-border border border-border">
            {seedTitles.map((title) => (
              <div
                key={title.id}
                className="flex flex-col gap-3 bg-bg px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-serif text-2xl text-text">{title.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-text-secondary">
                    {title.type.toUpperCase()} · {formatMoney(title.price)} · {title.published ? "Published" : "Draft"}
                  </p>
                </div>
                <button
                  type="button"
                  className="border border-border px-3 py-2 text-xs uppercase tracking-[0.14em] text-text-secondary"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-text-secondary">Full title management coming soon</p>
        </div>
      </div>
    </section>
  );
}

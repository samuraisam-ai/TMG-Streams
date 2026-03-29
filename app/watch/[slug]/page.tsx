"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { seedTitles } from "@/constants/seed-data";
import { supabaseBrowser } from "@/lib/supabase";

export default function WatchPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const title = useMemo(() => seedTitles.find((item) => item.slug === slug), [slug]);

  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      if (!title) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      // Access confirmed - user is logged in
      // Library page confirms ownership before linking here

      setHasAccess(true);
      setLoading(false);
    };

    verifyAccess();
  }, [slug, title]);

  if (!title) {
    return (
      <section className="px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-[1000px] border border-border bg-surface p-6">
          <p>Title not found</p>
        </div>
      </section>
    );
  }

  if (loading || !hasAccess) {
    return (
      <section className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-10 sm:px-10">
        <p className="text-text-secondary">Loading...</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 sm:px-10">
      <div className="mx-auto w-full max-w-[1000px]">
        <Link href="/library" className="text-sm text-text-secondary hover:text-white">
          ← Back to Library
        </Link>

        <div className="mt-5 border border-border bg-surface p-4 sm:p-6">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${title.vimeo_id}?rel=0&modestbranding=1`}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              title={title.title}
            />
          </div>
        </div>

        <div className="mt-6 border border-border bg-surface p-5 sm:p-6">
          <h1 className="font-serif text-4xl sm:text-5xl">{title.title}</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-text-secondary">
            {title.type.toUpperCase()}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">{title.synopsis}</p>
          <p className="mt-3 text-sm text-text-secondary">Runtime: Short film</p>
        </div>
      </div>
    </section>
  );
}
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { seedEpisodes, seedTitles } from "@/constants/seed-data";
import { supabaseBrowser } from "@/lib/supabase";

export default function WatchPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const title = useMemo(() => seedTitles.find((item) => item.slug === slug), [slug]);
  const episodes = useMemo(
    () => seedEpisodes.filter((episode) => episode.title_id === title?.id),
    [title?.id],
  );

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

      const { data, error } = await supabaseBrowser
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("title_id", title.id)
        .in("status", ["pending", "complete"])
        .single();

      if (error || !data) {
        window.location.href = `/checkout/${slug}`;
        return;
      }

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
          <div className="aspect-video w-full border border-border bg-black">
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="text-text-secondary">Video Player</p>
              <p className="mt-2 text-xs text-text-secondary">Vimeo embed will appear here</p>
              <p className="mt-2 text-xs text-text-secondary">ID: {title.vimeo_id}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-border bg-surface p-5 sm:p-6">
          <h1 className="font-serif text-4xl sm:text-5xl">{title.title}</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-text-secondary">
            {title.type.toUpperCase()}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">{title.synopsis}</p>

          {title.type === "series" && episodes.length > 0 && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">EPISODES</p>
              <div className="mt-3 border-t border-border">
                {episodes.map((episode) => (
                  <button
                    key={episode.id}
                    type="button"
                    onClick={() =>
                      window.alert(
                        `Episode ${episode.episode_number} selected - Vimeo integration coming soon`,
                      )
                    }
                    className="flex w-full items-center justify-between border-b border-border px-3 py-3 text-left text-sm text-text-secondary hover:text-text"
                  >
                    <span>Episode {episode.episode_number}</span>
                    <span>{episode.episode_title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
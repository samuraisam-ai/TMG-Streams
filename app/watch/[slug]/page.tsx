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
  const initialVimeoId = useMemo(() => {
    if (!title) {
      return "";
    }

    if (title.type === "series") {
      return episodes[0]?.vimeo_id ?? title.vimeo_id;
    }

    return title.vimeo_id;
  }, [episodes, title]);

  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [activeVimeoId, setActiveVimeoId] = useState(initialVimeoId);

  useEffect(() => {
    setActiveVimeoId(initialVimeoId);
  }, [initialVimeoId]);

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
        .eq("status", "complete")
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
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://player.vimeo.com/video/${activeVimeoId}?badge=0&autopause=0&player_id=0&app_id=58479&dnt=1`}
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

          {title.type === "series" && episodes.length > 0 && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">EPISODES</p>
              <div className="mt-3 border-t border-border">
                {episodes.map((episode) => (
                  <button
                    key={episode.id}
                    type="button"
                    onClick={() => setActiveVimeoId(episode.vimeo_id)}
                    className={`flex w-full items-center justify-between border-b border-border border-l-2 px-3 py-3 text-left text-sm transition-colors ${
                      activeVimeoId === episode.vimeo_id
                        ? "border-l-white text-text"
                        : "border-l-transparent text-text-secondary hover:text-text"
                    }`}
                  >
                    <span>Episode {episode.episode_number}</span>
                    <span className="flex items-center gap-2">
                      {activeVimeoId === episode.vimeo_id && (
                        <span className="border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white">
                          Now Playing
                        </span>
                      )}
                      <span>{episode.episode_title}</span>
                    </span>
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
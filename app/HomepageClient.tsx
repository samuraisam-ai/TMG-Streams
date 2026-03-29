"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TitleCard from "@/components/TitleCard";
import TitleModal from "@/components/TitleModal";
import type { Title } from "@/types";

interface HomepageClientProps {
  titles: Title[];
}

const formatPrice = (amountInCents: number) => `R${(amountInCents / 100).toFixed(2)}`;

const backdrops = [
  "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746037/Screenshot_2026-03-29_at_02.57.10_c0uyhl.png",
  "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746039/Screenshot_2026-03-29_at_02.54.54_fmjehq.png",
  "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746039/Screenshot_2026-03-29_at_02.54.42_zziii4.png",
  "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746040/Screenshot_2026-03-29_at_02.56.16_y3obme.png",
  "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746040/Screenshot_2026-03-29_at_02.56.51_sccfys.png",
];

export default function HomepageClient({ titles }: HomepageClientProps) {
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [activeBackdropIndex, setActiveBackdropIndex] = useState(0);
  const displayTitles = useMemo(() => titles.filter((title) => title.published), [titles]);
  const burgundy = useMemo(() => titles.find((t) => t.slug === "burgundy"), [titles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBackdropIndex((prev) => (prev + 1) % backdrops.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevBackdrop = () => {
    setActiveBackdropIndex((prev) => (prev - 1 + backdrops.length) % backdrops.length);
  };

  const handleNextBackdrop = () => {
    setActiveBackdropIndex((prev) => (prev + 1) % backdrops.length);
  };

  const handleDotClick = (index: number) => {
    setActiveBackdropIndex(index);
  };

  return (
    <>
      {/* Backdrop Carousel */}
      <div className="relative w-full h-[500px] overflow-hidden bg-bg">
        <div
          className="relative w-full h-full transition-opacity duration-1000"
          style={{ opacity: 1 }}
        >
          <img
            src={backdrops[activeBackdropIndex]}
            alt="Now showing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrevBackdrop}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-2xl transition"
            aria-label="Previous backdrop"
          >
            ←
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNextBackdrop}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-2xl transition"
            aria-label="Next backdrop"
          >
            →
          </button>

          {/* Center Text Overlay */}
          {burgundy && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <p className="text-xs uppercase tracking-widest text-[#c4873a]">NOW SHOWING</p>
              <h2 className="mt-2 font-serif text-4xl text-[#f5f0ea]">{burgundy.title}</h2>
              <p className="mt-2 text-sm text-[#f5f0ea] uppercase tracking-[0.15em]">
                {burgundy.type.toUpperCase()} · Short film
              </p>
              <Link
                href="/titles/burgundy"
                className="mt-6 border border-[#c4873a] bg-[#c4873a] px-6 py-2 text-sm font-medium text-[#0d0d0d] inline-block transition hover:opacity-90"
              >
                Watch Now
              </Link>
            </div>
          )}

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {backdrops.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === activeBackdropIndex ? "bg-[#c4873a]" : "bg-white/30"
                }`}
                aria-label={`Go to backdrop ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="border-y border-border bg-bg px-6 py-14 sm:px-10 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">ABOUT TMG</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
              Storytelling without compromise
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
              TMG Entertainment develops premium independent productions designed for audiences who
              value depth, atmosphere, and auteur vision over formula.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-base">
              TMG Streams brings that slate directly to viewers through a focused pay-per-view
              platform built for film lovers, with intentional curation and bold storytelling at the
              center.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 self-start sm:gap-4">
            <div className="border border-border bg-surface p-4">
              <p className="font-serif text-2xl sm:text-3xl">Est. 2020</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Foundation</p>
            </div>
            <div className="border border-border bg-surface p-4">
              <p className="font-serif text-2xl sm:text-3xl">South African</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Origin</p>
            </div>
            <div className="border border-border bg-surface p-4">
              <p className="font-serif text-2xl sm:text-3xl">Independent</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">Approach</p>
            </div>
          </div>
        </div>
      </section>

      <section id="titles" className="bg-bg px-6 py-14 sm:px-10 sm:py-20 scroll-mt-24">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">OUR WORK</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Available Now</h2>

          <div className="mt-8 flex gap-4 overflow-x-auto pb-2 md:hidden">
            {displayTitles.map((title) => (
              <div key={title.id} className="min-w-[72%] max-w-[280px]">
                <TitleCard title={title} onClick={() => setSelectedTitle(title)} />
              </div>
            ))}
          </div>

          <div className="mt-8 hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {displayTitles.map((title) => (
              <TitleCard key={title.id} title={title} onClick={() => setSelectedTitle(title)} />
            ))}
          </div>
        </div>
      </section>

      <TitleModal
        title={selectedTitle}
        open={Boolean(selectedTitle)}
        onClose={() => setSelectedTitle(null)}
        formatPrice={formatPrice}
      />
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import HomepageClient from "@/app/HomepageClient";
import { seedTitles } from "@/constants/seed-data";

export default function Home() {
  const backdrops = [
    "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746037/Screenshot_2026-03-29_at_02.57.10_c0uyhl.png",
    "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746039/Screenshot_2026-03-29_at_02.54.54_fmjehq.png",
    "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746039/Screenshot_2026-03-29_at_02.54.42_zziii4.png",
    "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746040/Screenshot_2026-03-29_at_02.56.16_y3obme.png",
    "https://res.cloudinary.com/dtjysgyny/image/upload/v1774746040/Screenshot_2026-03-29_at_02.56.51_sccfys.png",
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % backdrops.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [backdrops.length]);

  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-border bg-bg px-6 pt-20 sm:px-10">
        {/* Backdrop image */}
        <img
          src={backdrops[activeIndex]}
          alt="backdrop"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

        {/* Left arrow */}
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + backdrops.length) % backdrops.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white text-3xl px-2 py-1"
          aria-label="Previous"
        >
          ←
        </button>

        {/* Right arrow */}
        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % backdrops.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white text-3xl px-2 py-1"
          aria-label="Next"
        >
          →
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {backdrops.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? "bg-[#c4873a]" : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to backdrop ${i + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">TMG STREAMS</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight sm:text-6xl md:text-7xl">
            Independent Film. No Compromise.
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-text-secondary sm:text-base">
            Premium pay-per-view film and series from TMG Entertainment.
          </p>
          <a
            href="#titles"
            className="mt-8 border border-accent bg-accent px-8 py-3 text-sm font-medium uppercase tracking-wide text-bg transition-opacity hover:opacity-90"
          >
            Watch Now
          </a>
        </div>
      </section>

      <HomepageClient titles={seedTitles} />
    </>
  );
}

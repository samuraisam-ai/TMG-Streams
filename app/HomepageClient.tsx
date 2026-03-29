"use client";

import { useMemo, useState } from "react";
import TitleCard from "@/components/TitleCard";
import TitleModal from "@/components/TitleModal";
import type { Title } from "@/types";

interface HomepageClientProps {
  titles: Title[];
}

const formatPrice = (amountInCents: number) => `R${(amountInCents / 100).toFixed(2)}`;

export default function HomepageClient({ titles }: HomepageClientProps) {
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const displayTitles = useMemo(() => titles.filter((title) => title.published), [titles]);

  return (
    <>
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
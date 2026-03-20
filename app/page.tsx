import HomepageClient from "@/app/HomepageClient";
import { seedTitles } from "@/constants/seed-data";

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-border bg-bg px-6 pt-20 sm:px-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0a] via-[#0a0a0a] to-[#000000]" />
        <div className="absolute inset-0 bg-black/60" />

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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
      </section>

      <HomepageClient titles={seedTitles} />
    </>
  );
}

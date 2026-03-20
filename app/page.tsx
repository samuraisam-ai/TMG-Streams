import Link from "next/link";

export default function Home() {
  return (
    <section className="border-b border-border bg-surface p-6 sm:p-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">TMG Streams</p>
        <h1 className="text-4xl sm:text-5xl">Premium PPV Film & Series</h1>
        <p className="max-w-2xl text-sm text-text-secondary">
          Project scaffold ready with App Router routes, shared components, and typed mock data.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/titles/burgundy" className="border border-accent bg-accent px-4 py-2 text-sm text-bg">
            View Burgundy
          </Link>
          <Link href="/library" className="border border-border bg-transparent px-4 py-2 text-sm text-text">
            Go to Library
          </Link>
        </div>
      </div>
    </section>
  );
}

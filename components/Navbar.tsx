import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-surface">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-lg">
          TMG Streams
        </Link>
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <Link href="/library">Library</Link>
          <Link href="/auth">Auth</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </nav>
    </header>
  );
}
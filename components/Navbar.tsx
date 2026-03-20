"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const supabase = supabaseBrowser;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(session));
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleFilmsClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") {
      setMenuOpen(false);
      return;
    }

    const section = document.getElementById("titles");
    if (!section) {
      return;
    }

    event.preventDefault();
    setMenuOpen(false);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-black/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-lg text-text">
          TMG Streams
        </Link>

        <div className="hidden items-center gap-6 text-sm text-text-secondary md:flex">
          <Link href="/#titles" onClick={handleFilmsClick} className="hover:text-text">
            Films
          </Link>
          {!isAuthenticated && (
            <Link href="/auth" className="hover:text-text">
              Sign In
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/library" className="hover:text-text">
              My Library
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {!isAuthenticated && (
            <Link href="/auth" className="text-sm text-text-secondary hover:text-text">
              Sign In
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/library" className="text-sm text-text-secondary hover:text-text">
              My Library
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="border border-border px-3 py-2 text-sm text-text-secondary hover:border-white hover:text-white"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-border bg-black px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm text-text-secondary">
            <Link href="/#titles" onClick={handleFilmsClick} className="hover:text-text">
              Films
            </Link>
            {!isAuthenticated && (
              <Link href="/auth" onClick={() => setMenuOpen(false)} className="hover:text-text">
                Sign In
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/library" onClick={() => setMenuOpen(false)} className="hover:text-text">
                My Library
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
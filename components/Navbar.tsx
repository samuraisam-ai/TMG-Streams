"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const supabase = supabaseBrowser;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = async (userId: string, email: string | undefined) => {
      setUserEmail(email ?? null);
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();
      if (data) {
        setFullName((data as { full_name: string | null; avatar_url: string | null }).full_name ?? null);
        setAvatarUrl((data as { full_name: string | null; avatar_url: string | null }).avatar_url ?? null);
      }
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(session));
      if (session?.user) {
        loadProfile(session.user.id, session.user.email);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      if (session?.user) {
        loadProfile(session.user.id, session.user.email);
      } else {
        setFullName(null);
        setAvatarUrl(null);
        setUserEmail(null);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const firstName = fullName ? fullName.split(" ")[0] : null;
  const avatarLetter = fullName
    ? fullName[0].toUpperCase()
    : userEmail
    ? userEmail[0].toUpperCase()
    : "?";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-black/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-lg uppercase tracking-[0.3em] text-accent">
          OBELISK
        </Link>

        {/* Desktop nav */}
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
            <>
              <Link href="/library" className="hover:text-text">
                My Library
              </Link>
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2 hover:text-text"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-medium text-white">
                      {avatarLetter}
                    </span>
                  )}
                  {firstName && <span>{firstName}</span>}
                  <svg
                    className={`h-3 w-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 border border-border bg-surface">
                    <Link
                      href="/library"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-text-secondary hover:text-text"
                    >
                      My Profile
                    </Link>
                    <div className="border-t border-border" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2.5 text-left text-sm text-text-secondary hover:text-text"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-3 md:hidden">
          {!isAuthenticated && (
            <Link href="/auth" className="text-sm text-text-secondary hover:text-text">
              Sign In
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
              <>
                <Link href="/library" onClick={() => setMenuOpen(false)} className="hover:text-text">
                  My Library
                </Link>
                <Link href="/library" onClick={() => setMenuOpen(false)} className="hover:text-text">
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-left hover:text-text"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
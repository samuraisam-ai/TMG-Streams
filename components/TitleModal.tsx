"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Title } from "@/types";

interface TitleModalProps {
  open: boolean;
  title: Title | null;
  onClose: () => void;
  formatPrice: (amountInCents: number) => string;
}

export default function TitleModal({ open, title, onClose, formatPrice }: TitleModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [crewExpanded, setCrewExpanded] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const modal = modalRef.current;
    const focusable = modal?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusable?.[0];
    const lastElement = focusable?.[focusable.length - 1];
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstElement?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab" && firstElement && lastElement) {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !title) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${title.title} details`}
        className="relative max-h-[90vh] w-full max-w-[800px] overflow-y-auto border border-border bg-surface p-5 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-3 border border-border px-3 py-1 text-xl text-text-secondary hover:border-white hover:text-white"
        >
          ×
        </button>

        <div className="grid gap-6 pt-7 md:grid-cols-[260px_1fr] md:pt-2">
          <div className="aspect-[2/3] w-full border border-border bg-[#090909]">
            <img
              src={title.poster_url}
              alt={title.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">{title.type}</p>
            <h3 className="mt-2 font-serif text-4xl leading-tight">{title.title}</h3>
            <p className="mt-2 italic text-text-secondary">A TMG Entertainment original.</p>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">{title.synopsis}</p>

            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary">CAST</p>
              <p className="mt-2 text-sm text-text">{title.cast_list.join(", ")}</p>
            </div>

            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-text-secondary">CREW</p>
              <div>
                <div className="space-y-2 mt-2">
                  {Object.entries(title.crew)
                    .slice(0, crewExpanded ? undefined : 3)
                    .map(([role, names]) => (
                      <div key={role}>
                        <span className="text-text-secondary text-xs uppercase tracking-wide">
                          {role}:
                        </span>
                        <span className="text-text text-sm ml-2">
                          {names.join(", ")}
                        </span>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => setCrewExpanded(!crewExpanded)}
                  className="mt-3 text-xs text-[#c4873a] hover:underline"
                >
                  {crewExpanded ? "Hide credits ↑" : "Show full credits ↓"}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full border border-[#c4873a] bg-transparent px-4 py-3 text-sm font-medium text-[#c4873a]"
            >
              Watch Trailer
            </button>

            <div className="mt-6 border-t border-border pt-4">
              <p className="text-2xl font-medium text-text">{formatPrice(title.price)}</p>
              <Link
                href={`/checkout/${title.slug}`}
                className="mt-3 block w-full border border-[#c4873a] bg-[#c4873a] px-4 py-3 text-center text-sm font-medium text-[#0d0d0d]"
              >
                Buy Now - {formatPrice(title.price)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
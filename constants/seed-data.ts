import type { Title } from "@/types";

export const seedTitles: (Title & { tagline?: string })[] = [
  {
    id: "0177f0eb-f124-4880-a07f-94cdde25faae",
    slug: "burgundy",
    title: "Burgundy",
    type: "short",
    synopsis:
      "Two intelligence agents go undercover to infiltrate a human trafficking ring, risking everything to bring down two of its most dangerous operatives. A tense, cinematic short film.",
    tagline: "Some lines should never be crossed.",
    cast: ["Lead Actor", "Supporting Actor"],
    crew: ["Director", "Producer"],
    trailer_url: "https://example.com/trailer/burgundy",
    vimeo_id: "placeholder_youtube",
    price: 2500,
    poster_url: "https://example.com/images/burgundy-poster.jpg",
    backdrop_url: "https://example.com/images/burgundy-backdrop.jpg",
    published: true,
  },
];
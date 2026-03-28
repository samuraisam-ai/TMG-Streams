import type { Title } from "@/types";

type SeedTitle = Omit<Title, "cast" | "crew"> & {
  cast_list: string[];
  crew: Record<string, string[]>;
  tagline?: string;
};

export const seedTitles: SeedTitle[] = [
  {
    id: "0177f0eb-f124-4880-a07f-94cdde25faae",
    slug: "burgundy",
    title: "Burgundy",
    type: "short",
    synopsis:
      "Two intelligence agents go undercover to infiltrate a human trafficking ring, risking everything to bring down two of its most dangerous operatives. A tense, cinematic short film.",
    tagline: "Some lines should never be crossed.",
    cast_list: [
      "Ditebogo 'Didi' Mandita as Mrs Dube",
      "Kgotlello Kutama as Mr Dube",
      "Ofentse Lindani Khumalo as James Ratebe",
      "Peet Rudolph Van Jaarsveld as Luke Ratebe",
    ],
    crew: {
      "Directed by": ["Gaorteleleloe Mogokonyane", "Ignacius Lebogo"],
      "Written by": ["Gaorteleleloe Mogokonyane", "Milile 'Mylz' Msomi", "Angelo De Klerk"],
      "Produced by": [
        "Yolanda Connie Shoba",
        "Theophilus Pasineni",
        "Angelo De Klerk",
        "Modipadi Mokgohloa",
        "Natalie Githu",
      ],
      "Executive Producers": [
        "Matthew Prins",
        "Gaorteleleloe Mogokonyane",
        "Angelo De Klerk",
        "Theophilus Pasineni",
        "Milile 'Mylz' Msomi",
        "Ignacius Lebogo",
        "Okuhle Meke",
      ],
      "Unit Producer": ["Fhulufhelo Munyai"],
      "Director of Photography": ["Okuhle Meke"],
      "1st AC": ["Matthew Prins"],
      "2nd AC": ["Feziwe Nyoni"],
      Gaffer: ["Matthew Prins"],
      "1st Assistant Director": ["Azania Mokhemisa"],
      Editor: ["Natalie Githu"],
      "DIT / Colourist": ["Matthew Prins"],
      VFX: ["Matthew Prins", "Natalie Githu"],
      "Sound Designer": ["Tshepo Mokharanyana"],
      "Boom Operator": ["Tshepo Mokharanyana"],
      "Music by": ["Hugo"],
      "Production Design": ["Xhobisa Tom"],
      "Character Design & Styling": ["Xhobisa Tom"],
      BTS: ["Syanda 'Zebra' Dube", "Angelo De Klerk", "Theophilus Pasineni", "Milile 'Mylz' Msomi"],
      "Poster Design": ["Ignacius Lebogo"],
    },
    trailer_url: "https://example.com/trailer/burgundy",
    vimeo_id: "placeholder_youtube",
    price: 2500,
    poster_url: "https://example.com/images/burgundy-poster.jpg",
    backdrop_url: "https://example.com/images/burgundy-backdrop.jpg",
    published: true,
  },
];
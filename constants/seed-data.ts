import type { Episode, Title } from "@/types";

export const seedTitles: Title[] = [
  {
    id: "title_burgundy",
    slug: "burgundy",
    title: "Burgundy",
    type: "series",
    synopsis: "A placeholder synopsis for Burgundy.",
    cast: ["Lead Actor", "Supporting Actor"],
    crew: ["Director", "Producer"],
    trailer_url: "https://example.com/trailer/burgundy",
    vimeo_id: "000000000",
    price: 4999,
    poster_url: "https://example.com/images/burgundy-poster.jpg",
    backdrop_url: "https://example.com/images/burgundy-backdrop.jpg",
    published: true,
  },
];

export const seedEpisodes: Episode[] = [
  {
    id: "ep_1",
    title_id: "title_burgundy",
    episode_number: 1,
    episode_title: "Episode 1",
    vimeo_id: "100000001",
  },
  {
    id: "ep_2",
    title_id: "title_burgundy",
    episode_number: 2,
    episode_title: "Episode 2",
    vimeo_id: "100000002",
  },
  {
    id: "ep_3",
    title_id: "title_burgundy",
    episode_number: 3,
    episode_title: "Episode 3",
    vimeo_id: "100000003",
  },
];
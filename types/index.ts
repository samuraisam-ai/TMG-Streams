export interface Title {
  id: string;
  slug: string;
  title: string;
  type: "film" | "short" | "series";
  tagline?: string;
  synopsis: string;
  cast_list: string[];
  crew: string[];
  trailer_url: string;
  vimeo_id: string;
  price: number;
  poster_url: string;
  backdrop_url: string;
  published: boolean;
}

export interface Purchase {
  id: string;
  user_id: string;
  title_id: string;
  amount: number;
  payment_ref: string;
  status: string;
  created_at: string;
}

export interface Episode {
  id: string;
  title_id: string;
  episode_number: number;
  episode_title: string;
  vimeo_id: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
}
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.titles (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  type text check (type in ('film', 'short', 'series')) not null,
  synopsis text,
  tagline text,
  cast_list text[],
  crew jsonb,
  trailer_url text,
  vimeo_id text,
  price integer not null,
  poster_url text,
  backdrop_url text,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.episodes (
  id uuid default gen_random_uuid() primary key,
  title_id uuid references public.titles(id) on delete cascade,
  episode_number integer not null,
  episode_title text not null,
  vimeo_id text,
  duration_seconds integer,
  created_at timestamptz default now()
);

create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title_id uuid references public.titles(id) not null,
  amount integer not null,
  payment_ref text,
  status text check (status in ('pending', 'complete', 'failed')) default 'pending',
  created_at timestamptz default now(),
  unique(user_id, title_id)
);

alter table public.profiles enable row level security;
alter table public.titles enable row level security;
alter table public.episodes enable row level security;
alter table public.purchases enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "titles_select_published"
  on public.titles
  for select
  using (published = true);

create policy "titles_insert_service_role"
  on public.titles
  for insert
  with check (auth.role() = 'service_role');

create policy "titles_update_service_role"
  on public.titles
  for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "episodes_select_if_purchased"
  on public.episodes
  for select
  using (
    exists (
      select 1
      from public.purchases p
      where p.title_id = episodes.title_id
        and p.user_id = auth.uid()
        and p.status = 'complete'
    )
  );

create policy "purchases_select_own"
  on public.purchases
  for select
  using (auth.uid() = user_id);

create policy "purchases_insert_authenticated"
  on public.purchases
  for insert
  with check (auth.role() = 'authenticated' and auth.uid() = user_id);
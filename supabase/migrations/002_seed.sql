with inserted_title as (
  insert into public.titles (
    slug,
    title,
    type,
    synopsis,
    tagline,
    cast_list,
    crew,
    trailer_url,
    vimeo_id,
    price,
    poster_url,
    backdrop_url,
    published
  )
  values (
    'burgundy',
    'Burgundy',
    'series',
    'Placeholder synopsis for Burgundy.',
    'Placeholder tagline.',
    array['Placeholder Cast 1', 'Placeholder Cast 2'],
    '{"director":"Placeholder Director","producer":"Placeholder Producer"}'::jsonb,
    null,
    null,
    4999,
    null,
    null,
    true
  )
  on conflict (slug) do update set
    title = excluded.title,
    type = excluded.type,
    synopsis = excluded.synopsis,
    tagline = excluded.tagline,
    cast = excluded.cast,
    crew = excluded.crew,
    trailer_url = excluded.trailer_url,
    vimeo_id = excluded.vimeo_id,
    price = excluded.price,
    poster_url = excluded.poster_url,
    backdrop_url = excluded.backdrop_url,
    published = excluded.published
  returning id
)
insert into public.episodes (
  title_id,
  episode_number,
  episode_title,
  vimeo_id,
  duration_seconds
)
select
  inserted_title.id,
  ep.episode_number,
  ep.episode_title,
  ep.vimeo_id,
  null
from inserted_title
cross join (
  values
    (1, 'Episode 1', '100000001'),
    (2, 'Episode 2', '100000002'),
    (3, 'Episode 3', '100000003')
) as ep(episode_number, episode_title, vimeo_id)
on conflict do nothing;
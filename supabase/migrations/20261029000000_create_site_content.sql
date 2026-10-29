create table if not exists public.site_content (
  id smallint primary key default 1 check (id = 1),
  social_counts jsonb not null default '{"youtube":7690,"instagram":48500,"facebook":35200,"tiktok":28400}'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  gems_count bigint not null default 0 check (gems_count >= 0 and gems_count <= 9007199254740991),
  updated_at timestamptz not null default now(),
  constraint social_counts_is_object check (jsonb_typeof(social_counts) = 'object'),
  constraint videos_is_array check (jsonb_typeof(videos) = 'array')
);

alter table public.site_content enable row level security;
revoke all on table public.site_content from anon, authenticated;
grant select, update on table public.site_content to service_role;

insert into public.site_content (id, social_counts, videos, gems_count)
values (
  1,
  '{"youtube":7690,"instagram":48500,"facebook":35200,"tiktok":28400}'::jsonb,
  '[
    {"id":"vid-1","youtubeId":"584WblbsNJE","titleAr":"Konstantínos Tzolákis 🇬🇷🧤🐯 — إبداع الحراسة اليونانية وتصديات تاريخية","titleFr":"Konstantínos Tzolákis 🇬🇷🧤🐯 — Arrêts décisifs & Révélation","url":"https://www.youtube.com/watch?v=584WblbsNJE","embedUrl":"https://www.youtube.com/embed/584WblbsNJE?autoplay=1","thumbnail":"https://i.ytimg.com/vi/584WblbsNJE/hqdefault.jpg","fallbackThumbnail":"https://i.ytimg.com/vi/584WblbsNJE/mqdefault.jpg","tagAr":"فيديو تحليلي رسمي","tagFr":"Vidéo officielle","author":"Old bijou"},
    {"id":"vid-2","youtubeId":"fOn1UM91X0Y","titleAr":"PEDRO 💙❤️🔇🔚 — سحر البلوغرانا ونهاية الحقبة الذهبية","titleFr":"PEDRO 💙❤️🔇🔚 — La Magie Blaugrana & Fin d''une Ère","url":"https://www.youtube.com/watch?v=fOn1UM91X0Y","embedUrl":"https://www.youtube.com/embed/fOn1UM91X0Y?autoplay=1","thumbnail":"https://i.ytimg.com/vi/fOn1UM91X0Y/hqdefault.jpg","fallbackThumbnail":"https://i.ytimg.com/vi/fOn1UM91X0Y/mqdefault.jpg","tagAr":"برشلونة وأساطير","tagFr":"Barça & Légendes","author":"Old bijou"},
    {"id":"vid-3","youtubeId":"1KiAq-JRhOY","titleAr":"Leandro Paredes 🃏 — مهندس الوسط والجوكر التكتيكي في الميدان","titleFr":"Leandro Paredes 🃏 — Le Joker Tactique au Milieu de Terrain","url":"https://www.youtube.com/watch?v=1KiAq-JRhOY","embedUrl":"https://www.youtube.com/embed/1KiAq-JRhOY?autoplay=1","thumbnail":"https://i.ytimg.com/vi/1KiAq-JRhOY/hqdefault.jpg","fallbackThumbnail":"https://i.ytimg.com/vi/1KiAq-JRhOY/mqdefault.jpg","tagAr":"تكتيك ولاعبين","tagFr":"Tactique & Joueurs","author":"Old bijou"},
    {"id":"vid-4","youtubeId":"afqtGfJJf88","titleAr":"João Neves 🇵🇹💙 — الموهبة البرتغالية الصاعدة وسيد خط الوسط","titleFr":"João Neves 🇵🇹💙 — La Pépite Portugaise du Milieu","url":"https://www.youtube.com/watch?v=afqtGfJJf88","embedUrl":"https://www.youtube.com/embed/afqtGfJJf88?autoplay=1","thumbnail":"https://i.ytimg.com/vi/afqtGfJJf88/hqdefault.jpg","fallbackThumbnail":"https://i.ytimg.com/vi/afqtGfJJf88/mqdefault.jpg","tagAr":"مواهب النخبة","tagFr":"Talents d''Élite","author":"Old bijou"}
  ]'::jsonb,
  0
)
on conflict (id) do nothing;

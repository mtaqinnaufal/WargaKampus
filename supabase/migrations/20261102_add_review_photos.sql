-- Add photos for place reviews (direct upload to Supabase Storage).
-- Run once in the Supabase SQL Editor for an existing project.
-- Fresh installs already get this from supabase/schema.sql.

create table if not exists public.place_review_photos (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.place_reviews(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists place_review_photos_review_idx
  on public.place_review_photos(review_id, sort_order);

alter table public.place_review_photos enable row level security;

drop policy if exists "place_review_photos_read" on public.place_review_photos;
create policy "place_review_photos_read" on public.place_review_photos for select using (
  exists (
    select 1 from public.place_reviews r
    join public.places p on p.id = r.place_id
    where r.id = review_id
      and (p.status = 'verified' or p.created_by = auth.uid() or public.is_admin())
  )
);
drop policy if exists "place_review_photos_insert_own" on public.place_review_photos;
create policy "place_review_photos_insert_own" on public.place_review_photos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.place_reviews r where r.id = review_id and r.user_id = auth.uid())
);
drop policy if exists "place_review_photos_delete_own" on public.place_review_photos;
create policy "place_review_photos_delete_own" on public.place_review_photos for delete to authenticated using (auth.uid() = user_id or public.is_admin());

grant select on public.place_review_photos to anon, authenticated;
grant insert, update, delete on public.place_review_photos to authenticated;

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do nothing;

drop policy if exists "wargakampus_public_images_read" on storage.objects;
create policy "wargakampus_public_images_read"
  on storage.objects for select
  using (bucket_id in ('place-photos', 'post-photos', 'review-photos', 'avatars'));

drop policy if exists "wargakampus_authenticated_upload" on storage.objects;
create policy "wargakampus_authenticated_upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('place-photos', 'post-photos', 'review-photos', 'avatars')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

notify pgrst, 'reload schema';

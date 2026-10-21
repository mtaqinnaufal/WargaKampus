-- Public read access for all published posts.
-- Interactions (insert/update/delete) keep their authenticated-only policies.
-- Run this once in the Supabase SQL Editor if the project already has the old policies.

drop policy if exists "posts_read" on public.posts;
create policy "posts_read" on public.posts
  for select
  using (status = 'published');

drop policy if exists "post_photos_read" on public.post_photos;
create policy "post_photos_read" on public.post_photos
  for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id
        and p.status = 'published'
    )
  );

drop policy if exists "comments_read" on public.comments;
create policy "comments_read" on public.comments
  for select
  using (
    status = 'published'
    and exists (
      select 1 from public.posts p
      where p.id = post_id
        and p.status = 'published'
    )
  );

notify pgrst, 'reload schema';

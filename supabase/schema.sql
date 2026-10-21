-- WargaKampus database schema for Supabase.
-- Run this once in a new Supabase project, then run supabase/seed.sql.
-- The app uses Supabase Auth, Postgres, RLS, and Storage.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  radius_km numeric(6,2) not null default 3.0 check (radius_km > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'mahasiswa' check (role in ('mahasiswa', 'pemilik', 'admin')),
  campus_id uuid references public.campuses(id) on delete set null,
  avatar_url text,
  bio text,
  reputation_points integer not null default 0 check (reputation_points >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.place_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default 'map-pin',
  sort_order integer not null default 0
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  campus_id uuid not null references public.campuses(id) on delete cascade,
  category_id uuid not null references public.place_categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  address text,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  price_min integer check (price_min is null or price_min >= 0),
  price_max integer check (price_max is null or price_max >= 0),
  price_level smallint not null default 2 check (price_level between 1 and 4),
  open_hours jsonb not null default '{}'::jsonb,
  facilities text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected', 'closed')),
  is_claimed boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  osm_id text,
  source text not null default 'user' check (source in ('user', 'osm', 'demo')),
  rating_avg numeric(3,2) not null default 0 check (rating_avg between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists places_osm_id_key
  on public.places(osm_id) where osm_id is not null;
create index if not exists places_campus_status_idx on public.places(campus_id, status);
create index if not exists places_category_idx on public.places(category_id);

create table if not exists public.place_photos (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.place_reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text,
  visited_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (place_id, user_id)
);

create index if not exists place_reviews_place_idx on public.place_reviews(place_id, created_at desc);

create table if not exists public.place_updates (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('price', 'hours', 'closed', 'other')),
  payload jsonb not null default '{}'::jsonb,
  note text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  campus_id uuid not null references public.campuses(id) on delete cascade,
  category text not null default 'tips' check (category in ('tips', 'promo', 'review', 'cari-teman', 'info-kampus', 'curhat')),
  body text not null check (char_length(body) between 8 and 2000),
  visibility text not null default 'campus' check (visibility in ('campus', 'public')),
  status text not null default 'published' check (status in ('published', 'hidden', 'removed')),
  like_count integer not null default 0 check (like_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_campus_created_idx on public.posts(campus_id, created_at desc);
create index if not exists posts_place_idx on public.posts(place_id);

create table if not exists public.post_photos (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table if not exists public.post_tags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  unique (post_id, tag_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  status text not null default 'published' check (status in ('published', 'hidden', 'removed')),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments(post_id, created_at);

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index if not exists post_likes_post_idx on public.post_likes(post_id);

create table if not exists public.saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  place_id uuid references public.places(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  check ((place_id is not null)::int + (post_id is not null)::int = 1)
);

create unique index if not exists saves_user_place_key
  on public.saves(user_id, place_id) where place_id is not null;
create unique index if not exists saves_user_post_key
  on public.saves(user_id, post_id) where post_id is not null;
create index if not exists saves_user_idx on public.saves(user_id);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (follower_id <> following_id),
  unique (follower_id, following_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('place', 'post', 'comment', 'user')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 8 and 500),
  status text not null default 'open' check (status in ('open', 'reviewed', 'actioned', 'rejected')),
  handled_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists reports_status_idx on public.reports(status, created_at);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

create table if not exists public.business_claims (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  proof_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_type text not null,
  target_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

-- ---------------------------------------------------------------------------
-- Functions and triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists places_set_updated_at on public.places;
create trigger places_set_updated_at
  before update on public.places
  for each row execute function public.set_updated_at();

drop trigger if exists place_reviews_set_updated_at on public.place_reviews;
create trigger place_reviews_set_updated_at
  before update on public.place_reviews
  for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

create or replace function public.current_campus_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select campus_id from public.profiles where id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_name text;
  meta_campus uuid;
begin
  meta_name := coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1));

  begin
    meta_campus := nullif(new.raw_user_meta_data ->> 'campus_id', '')::uuid;
  exception when others then
    meta_campus := null;
  end;

  insert into public.profiles (id, name, email, role, campus_id)
  values (new.id, meta_name, new.email, 'mahasiswa', meta_campus)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' and not public.is_admin() then
    if new.role <> old.role
      or new.reputation_points <> old.reputation_points
      or new.is_active <> old.is_active
      or new.email <> old.email
    then
      raise exception 'Only admins can change role, reputation, status, or email';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_fields on public.profiles;
create trigger profiles_protect_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

create or replace function public.protect_place_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status <> old.status
    and coalesce(auth.role(), '') <> 'service_role'
    and not public.is_admin()
  then
    raise exception 'Only admins can change place status';
  end if;
  return new;
end;
$$;

drop trigger if exists places_protect_status on public.places;
create trigger places_protect_status
  before update on public.places
  for each row execute function public.protect_place_status();

create or replace function public.sync_place_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_place uuid;
begin
  target_place := case when tg_op = 'DELETE' then old.place_id else new.place_id end;

  update public.places p
  set rating_avg = coalesce(
        (select round(avg(r.rating)::numeric, 2) from public.place_reviews r where r.place_id = target_place),
        0
      ),
      review_count = (select count(*) from public.place_reviews r where r.place_id = target_place)
  where p.id = target_place;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists place_reviews_sync_rating on public.place_reviews;
create trigger place_reviews_sync_rating
  after insert or update or delete on public.place_reviews
  for each row execute function public.sync_place_rating();

create or replace function public.sync_post_like_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.posts set like_count = greatest(0, like_count - 1) where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists post_likes_sync_count on public.post_likes;
create trigger post_likes_sync_count
  after insert or delete on public.post_likes
  for each row execute function public.sync_post_like_count();

create or replace function public.sync_comment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'published' then
      update public.posts set comment_count = comment_count + 1 where id = new.post_id;
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.status = 'published' then
      update public.posts set comment_count = greatest(0, comment_count - 1) where id = old.post_id;
    end if;
    return old;
  end if;

  if old.status = 'published' and new.status <> 'published' then
    update public.posts set comment_count = greatest(0, comment_count - 1) where id = new.post_id;
  elsif old.status <> 'published' and new.status = 'published' then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
  end if;

  return new;
end;
$$;

drop trigger if exists comments_sync_count on public.comments;
create trigger comments_sync_count
  after insert or update or delete on public.comments
  for each row execute function public.sync_comment_count();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.campuses enable row level security;
alter table public.profiles enable row level security;
alter table public.place_categories enable row level security;
alter table public.places enable row level security;
alter table public.place_photos enable row level security;
alter table public.place_reviews enable row level security;
alter table public.place_updates enable row level security;
alter table public.posts enable row level security;
alter table public.post_photos enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.saves enable row level security;
alter table public.follows enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.business_claims enable row level security;
alter table public.audit_logs enable row level security;

-- Campuses
drop policy if exists "campuses_read" on public.campuses;
create policy "campuses_read" on public.campuses for select using (true);
drop policy if exists "campuses_admin" on public.campuses;
create policy "campuses_admin" on public.campuses for all using (public.is_admin()) with check (public.is_admin());

-- Categories
drop policy if exists "place_categories_read" on public.place_categories;
create policy "place_categories_read" on public.place_categories for select using (true);
drop policy if exists "place_categories_admin" on public.place_categories;
create policy "place_categories_admin" on public.place_categories for all using (public.is_admin()) with check (public.is_admin());

-- Profiles
drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles for select using (is_active = true or id = auth.uid() or public.is_admin());
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- Places
drop policy if exists "places_read" on public.places;
create policy "places_read" on public.places for select using (
  status = 'verified'
  or created_by = auth.uid()
  or owner_id = auth.uid()
  or public.is_admin()
);
drop policy if exists "places_insert_own" on public.places;
create policy "places_insert_own" on public.places for insert to authenticated with check (
  created_by = auth.uid() and status = 'pending' and source = 'user'
);
drop policy if exists "places_update_creator" on public.places;
create policy "places_update_creator" on public.places for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
drop policy if exists "places_update_owner" on public.places;
create policy "places_update_owner" on public.places for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "places_admin" on public.places;
create policy "places_admin" on public.places for all using (public.is_admin()) with check (public.is_admin());

-- Place photos
drop policy if exists "place_photos_read" on public.place_photos;
create policy "place_photos_read" on public.place_photos for select using (
  exists (
    select 1 from public.places p
    where p.id = place_id
      and (p.status = 'verified' or p.created_by = auth.uid() or p.owner_id = auth.uid() or public.is_admin())
  )
);
drop policy if exists "place_photos_insert_own" on public.place_photos;
create policy "place_photos_insert_own" on public.place_photos for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "place_photos_delete_own" on public.place_photos;
create policy "place_photos_delete_own" on public.place_photos for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- Place reviews
drop policy if exists "place_reviews_read" on public.place_reviews;
create policy "place_reviews_read" on public.place_reviews for select using (
  exists (
    select 1 from public.places p
    where p.id = place_id
      and (p.status = 'verified' or p.created_by = auth.uid() or public.is_admin())
  )
);
drop policy if exists "place_reviews_insert_own" on public.place_reviews;
create policy "place_reviews_insert_own" on public.place_reviews for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.places p where p.id = place_id and p.status = 'verified')
);
drop policy if exists "place_reviews_update_own" on public.place_reviews;
create policy "place_reviews_update_own" on public.place_reviews for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "place_reviews_delete_own" on public.place_reviews;
create policy "place_reviews_delete_own" on public.place_reviews for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- Place updates
drop policy if exists "place_updates_read" on public.place_updates;
create policy "place_updates_read" on public.place_updates for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "place_updates_insert_own" on public.place_updates;
create policy "place_updates_insert_own" on public.place_updates for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "place_updates_admin" on public.place_updates;
create policy "place_updates_admin" on public.place_updates for update using (public.is_admin()) with check (public.is_admin());

-- Posts
drop policy if exists "posts_read" on public.posts;
create policy "posts_read" on public.posts for select using (status = 'published');
drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own" on public.posts for insert to authenticated with check (auth.uid() = user_id and status = 'published');
drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own" on public.posts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own" on public.posts for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- Post photos
drop policy if exists "post_photos_read" on public.post_photos;
create policy "post_photos_read" on public.post_photos for select using (
  exists (
    select 1 from public.posts p
    where p.id = post_id
      and p.status = 'published'
  )
);
drop policy if exists "post_photos_insert_own" on public.post_photos;
create policy "post_photos_insert_own" on public.post_photos for insert to authenticated with check (
  exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid())
);
drop policy if exists "post_photos_delete_own" on public.post_photos;
create policy "post_photos_delete_own" on public.post_photos for delete to authenticated using (
  exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid())
  or public.is_admin()
);

-- Tags
drop policy if exists "tags_read" on public.tags;
create policy "tags_read" on public.tags for select using (true);
drop policy if exists "tags_admin" on public.tags;
create policy "tags_admin" on public.tags for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "post_tags_read" on public.post_tags;
create policy "post_tags_read" on public.post_tags for select using (true);
drop policy if exists "post_tags_admin" on public.post_tags;
create policy "post_tags_admin" on public.post_tags for all using (public.is_admin()) with check (public.is_admin());

-- Comments
drop policy if exists "comments_read" on public.comments;
create policy "comments_read" on public.comments for select using (
  status = 'published'
  and exists (
    select 1 from public.posts p
    where p.id = post_id
      and p.status = 'published'
  )
);
drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own" on public.comments for insert to authenticated with check (auth.uid() = user_id and status = 'published');
drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own" on public.comments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own" on public.comments for delete to authenticated using (auth.uid() = user_id or public.is_admin());

-- Likes
drop policy if exists "post_likes_read" on public.post_likes;
create policy "post_likes_read" on public.post_likes for select using (true);
drop policy if exists "post_likes_insert_own" on public.post_likes;
create policy "post_likes_insert_own" on public.post_likes for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "post_likes_delete_own" on public.post_likes;
create policy "post_likes_delete_own" on public.post_likes for delete to authenticated using (auth.uid() = user_id);

-- Saves
drop policy if exists "saves_select_own" on public.saves;
create policy "saves_select_own" on public.saves for select to authenticated using (auth.uid() = user_id);
drop policy if exists "saves_insert_own" on public.saves;
create policy "saves_insert_own" on public.saves for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "saves_delete_own" on public.saves;
create policy "saves_delete_own" on public.saves for delete to authenticated using (auth.uid() = user_id);

-- Follows
drop policy if exists "follows_read" on public.follows;
create policy "follows_read" on public.follows for select using (true);
drop policy if exists "follows_insert_own" on public.follows;
create policy "follows_insert_own" on public.follows for insert to authenticated with check (auth.uid() = follower_id);
drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own" on public.follows for delete to authenticated using (auth.uid() = follower_id);

-- Reports
drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports for insert to authenticated with check (auth.uid() = reporter_id and status = 'open');
drop policy if exists "reports_read_own_or_admin" on public.reports;
create policy "reports_read_own_or_admin" on public.reports for select using (auth.uid() = reporter_id or public.is_admin());
drop policy if exists "reports_admin_update" on public.reports;
create policy "reports_admin_update" on public.reports for update using (public.is_admin()) with check (public.is_admin());

-- Notifications
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications for select to authenticated using (auth.uid() = user_id or public.is_admin());
drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Business claims
drop policy if exists "business_claims_insert_own" on public.business_claims;
create policy "business_claims_insert_own" on public.business_claims for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "business_claims_read_own_or_admin" on public.business_claims;
create policy "business_claims_read_own_or_admin" on public.business_claims for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "business_claims_admin_update" on public.business_claims;
create policy "business_claims_admin_update" on public.business_claims for update using (public.is_admin()) with check (public.is_admin());

-- Audit logs
drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read" on public.audit_logs for select using (public.is_admin());
drop policy if exists "audit_logs_admin_insert" on public.audit_logs;
create policy "audit_logs_admin_insert" on public.audit_logs for insert to authenticated with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.current_campus_id() to anon, authenticated;

-- Profiles expose public fields only. Email stays in auth.users.
revoke select on public.profiles from anon, authenticated;
grant select (id, name, avatar_url, role, campus_id, bio, reputation_points, is_active, created_at, updated_at)
  on public.profiles to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage buckets and policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('place-photos', 'place-photos', true),
  ('post-photos', 'post-photos', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "wargakampus_public_images_read" on storage.objects;
create policy "wargakampus_public_images_read"
  on storage.objects for select
  using (bucket_id in ('place-photos', 'post-photos', 'avatars'));

drop policy if exists "wargakampus_authenticated_upload" on storage.objects;
create policy "wargakampus_authenticated_upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('place-photos', 'post-photos', 'avatars')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

notify pgrst, 'reload schema';

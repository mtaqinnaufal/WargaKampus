-- Remove tables that the application does not use.
-- These were reserved for roadmap features (condition reports, hashtags,
-- follow, notifications, business claims) and have no code references.
--
-- Destructive: review before running. Run once in the Supabase SQL Editor.
-- Fresh installs already omit these tables in supabase/schema.sql.

drop table if exists public.notifications cascade;
drop table if exists public.business_claims cascade;
drop table if exists public.follows cascade;
drop table if exists public.place_updates cascade;
drop table if exists public.post_tags cascade;
drop table if exists public.tags cascade;

notify pgrst, 'reload schema';

-- ============================================================================
-- 0001_profiles.sql
--
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
--
-- Keeping migrations as numbered files in the repo (rather than only clicking
-- around the table editor) means your schema is version-controlled, reviewable
-- in a PR, and reproducible on a fresh project. This is how real teams work.
-- ============================================================================


-- ── The tier enum ───────────────────────────────────────────────────────────
-- These are the three plans on your pricing page. An enum makes it impossible
-- to write a typo like 'devotd' into the column — Postgres rejects it at the
-- database level, no matter what bug your API has.
--
-- Tradeoff to know: adding a value later is easy (ALTER TYPE ... ADD VALUE),
-- but renaming or removing one is genuinely annoying. Use enums for small,
-- stable sets. Plans qualify.
create type public.subscription_tier as enum ('seeker', 'devoted', 'chosen');


-- ── The profiles table ──────────────────────────────────────────────────────
-- WHY A SEPARATE TABLE AT ALL?
--
-- Supabase already stores your users in `auth.users`. But that table lives in
-- the `auth` schema, which Supabase owns and migrates — you don't add columns
-- to it. So the standard pattern is a table in your own `public` schema whose
-- primary key IS the auth user's id. One row in auth.users ↔ one row here.
create table public.profiles (
  -- Not a fresh id — the SAME uuid as the auth user. That's what makes this a
  -- true 1:1 extension rather than a loosely related table.
  --
  -- `on delete cascade` means deleting the auth user deletes this row too.
  -- Without it you'd accumulate orphaned profiles pointing at users who no
  -- longer exist, and GDPR deletion requests would be a manual nightmare.
  id uuid primary key references auth.users(id) on delete cascade,

  display_name text,

  -- ── Birth data (drives every reading in the app) ──────────────────────────
  -- All nullable: the user signs up first and fills this in afterwards, so a
  -- profile legitimately exists in an incomplete state.
  birth_date date,

  -- Separate from the date because a huge number of people genuinely don't
  -- know their birth time, and astrologically it's the difference between a
  -- rough sun-sign reading and a real natal chart. Nullable on purpose.
  birth_time time,

  -- What the user typed, e.g. "Leicester, UK". Kept for display.
  birth_place text,

  -- What you actually compute with. A chart needs coordinates, not a string.
  -- numeric (not float) because it's exact — you'll thank yourself later.
  birth_lat numeric(9, 6),
  birth_lng numeric(9, 6),

  -- IANA name, e.g. "Europe/London". Required to convert a local birth time
  -- into UTC. Storing the offset instead would be a bug: offsets change with
  -- daylight saving and with history.
  birth_timezone text,

  -- ── Billing ───────────────────────────────────────────────────────────────
  -- Default matches your free plan, so a brand new signup is immediately in a
  -- valid state with no extra write.
  tier public.subscription_tier not null default 'seeker',

  -- `timestamptz`, never `timestamp`. timestamptz stores an absolute moment;
  -- plain timestamp stores a wall-clock reading with no timezone, which means
  -- it is ambiguous and will eventually be wrong. Always timestamptz.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ── Row Level Security ──────────────────────────────────────────────────────
-- Enabled with ZERO policies = deny everything to the public `anon` and
-- `authenticated` roles. Your Express server uses the secret key, which
-- bypasses RLS, so it is unaffected.
--
-- This is the lock on the door your API doesn't use. If anyone grabs the
-- publishable key out of your JS bundle (they can, it's public by design),
-- they get exactly nothing.
alter table public.profiles enable row level security;


-- ── Auto-create a profile on signup ─────────────────────────────────────────
-- IMPORTANT ARCHITECTURAL POINT:
--
-- Signup does NOT go through Express. The browser talks straight to Supabase
-- Auth. So there is no server-side request we could hook to insert the profile
-- row — the only reliable place is inside the database itself.
--
-- We could have the frontend call POST /api/profile right after signup, but
-- if the user closes the tab first you get an auth user with no profile, and
-- every later query has to defend against that. A trigger cannot be skipped.
create function public.handle_new_user()
returns trigger
language plpgsql
-- `security definer` runs this with the function owner's privileges, which is
-- what lets it write to public.profiles during a signup where the caller is
-- effectively nobody yet.
security definer
-- Pinning search_path is a REQUIRED hardening step for security definer
-- functions. Without it, someone who can create objects could shadow a table
-- name and hijack the elevated privileges.
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    -- Populated if the user signed up with Google/OAuth; null for plain email.
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── Keep updated_at honest ──────────────────────────────────────────────────
-- The column has `default now()`, but a default only applies on INSERT. Without
-- this trigger, updated_at would be frozen at creation time forever — a subtle
-- bug you wouldn't notice until you tried to sort by "recently changed".
create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

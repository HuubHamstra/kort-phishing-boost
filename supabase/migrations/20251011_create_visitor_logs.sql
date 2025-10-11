-- Creates a table to store anonymous visitor logs
-- Note: Do NOT store MAC addresses; they are not available to browsers and
-- storing hardware identifiers would raise privacy concerns.

create table if not exists public.visitor_logs (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone not null default now(),
  ip text,
  user_agent text,
  referrer text,
  path text,
  session_id text,
  language text,
  screen_width int,
  screen_height int
);

-- Optional: enable RLS but allow inserts via anon key only through a restricted function
-- For simplicity, keep RLS disabled here because inserts are done by Edge Function using service role key
alter table public.visitor_logs disable row level security;

create index if not exists visitor_logs_created_at_idx on public.visitor_logs (created_at desc);
create index if not exists visitor_logs_ip_idx on public.visitor_logs (ip);

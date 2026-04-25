-- Run this in supabase
create table if not exists public.forum_posts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid(),
  author_display_name text not null,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint forum_posts_content_length_check check (char_length(trim(content)) between 1 and 500)
);

alter table public.forum_posts
  alter column user_id set default auth.uid();

do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'forum_posts'
      and constraint_name = 'forum_posts_user_id_fkey'
  ) then
    alter table public.forum_posts
      drop constraint forum_posts_user_id_fkey;
  end if;
end $$;

alter table public.forum_posts
  add constraint forum_posts_user_id_fkey
  foreign key (user_id)
  references auth.users (id)
  on delete cascade;

create index if not exists forum_posts_created_at_idx
  on public.forum_posts (created_at desc);

create index if not exists forum_posts_user_created_at_idx
  on public.forum_posts (user_id, created_at desc);

alter table public.forum_posts enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'forum_posts'
      and policyname = 'forum_posts_select_authenticated'
  ) then
    create policy forum_posts_select_authenticated
      on public.forum_posts
      for select
      to authenticated
      using (true);
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'forum_posts'
      and policyname = 'forum_posts_insert_own'
  ) then
    drop policy forum_posts_insert_own on public.forum_posts;
  end if;

  create policy forum_posts_insert_own
    on public.forum_posts
    for insert
    to authenticated
    with check (user_id = auth.uid());
end $$;

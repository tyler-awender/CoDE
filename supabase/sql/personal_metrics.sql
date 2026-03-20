-- Personal metrics aggregation for authenticated users

-- Helpful indexes for aggregation queries
create index if not exists metrics_user_created_at_idx
  on public.metrics (user_id, created_at desc);

create index if not exists metrics_user_score_idx
  on public.metrics (user_id, score desc);

-- Ensure row-level security is active on metrics
alter table public.metrics enable row level security;

-- Read access scoped to owner only
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'metrics'
      and policyname = 'metrics_select_own'
  ) then
    create policy metrics_select_own
      on public.metrics
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

-- RPC: aggregate personal games played, best score, and current daily streak
create or replace function public.get_personal_metrics()
returns table (
  games_played bigint,
  best_score integer,
  current_streak integer
)
language sql
stable
security invoker
set search_path = public
as $$
with user_metrics as (
  select
    coalesce(games_played, 1) as games_played,
    score,
    created_at::date as played_day
  from public.metrics
  where user_id = auth.uid()
),
agg as (
  select
    coalesce(sum(games_played), 0)::bigint as games_played,
    coalesce(max(score), 0)::integer as best_score
  from user_metrics
),
days as (
  select distinct played_day
  from user_metrics
),
ranked as (
  select
    played_day,
    row_number() over (order by played_day desc) as rn,
    max(played_day) over () as latest_day
  from days
),
streak as (
  select count(*)::integer as current_streak
  from ranked
  where played_day = (latest_day - ((rn - 1) * interval '1 day'))::date
)
select
  agg.games_played,
  agg.best_score,
  coalesce(streak.current_streak, 0) as current_streak
from agg
cross join streak;
$$;

grant execute on function public.get_personal_metrics() to authenticated;

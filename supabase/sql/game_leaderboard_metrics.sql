-- Simple game-specific leaderboard metrics

create index if not exists games_played_game_name_score_idx
  on public.games_played (game_name, score desc, completed_at desc);

create index if not exists games_played_game_name_user_idx
  on public.games_played (game_name, user_id);

create or replace function public.get_game_metrics(game_name text)
returns table (
  plays bigint,
  unique_players bigint,
  top_score integer
)
language sql
stable
security definer
set search_path = public
as $$
with normalized as (
  select
    g.user_id,
    g.score,
    coalesce(
      nullif(g.game_name, ''),
      nullif(to_jsonb(g)->>'game', ''),
      nullif(to_jsonb(g)->>'game_type', '')
    ) as game
  from public.games_played g
)
select
  count(*)::bigint as plays,
  count(distinct user_id)::bigint as unique_players,
  coalesce(max(score), 0)::integer as top_score
from normalized
where game = game_name;
$$;

grant execute on function public.get_game_metrics(text) to authenticated;

create or replace function public.get_game_leaderboard(game_name text, p_limit integer default 10)
returns table (
  rank bigint,
  display_name text,
  username text,
  best_score integer,
  plays bigint
)
language sql
stable
security definer
set search_path = public
as $$
with normalized as (
  select
    g.user_id,
    g.score,
    coalesce(
      nullif(g.game_name, ''),
      nullif(to_jsonb(g)->>'game', ''),
      nullif(to_jsonb(g)->>'game_type', '')
    ) as game
  from public.games_played g
),
per_user as (
  select
    n.user_id,
    coalesce(max(n.score), 0)::integer as best_score,
    count(*)::bigint as plays
  from normalized n
  where n.game = game_name
  group by n.user_id
),
ranked as (
  select
    dense_rank() over (order by p.best_score desc, p.plays desc) as rank,
    p.user_id,
    p.best_score,
    p.plays
  from per_user p
)
select
  r.rank,
  coalesce(u.display_name, u.username, 'Anonymous') as display_name,
  coalesce(u.username, '') as username,
  r.best_score,
  r.plays
from ranked r
left join public.users u on u.id = r.user_id
order by r.rank asc, display_name asc
limit greatest(p_limit, 1);
$$;

grant execute on function public.get_game_leaderboard(text, integer) to authenticated;

import { createClient } from "@/lib/supabase/server";
import { Suspense } from 'react';
import LineChart from './chart'

async function Dashboard() {
  const supabase = await createClient();
  const { data: daily_games_played } = await supabase.rpc('get_daily_games_played');
  const { data: daily_active_users } = await supabase.rpc('get_daily_active_users');
  const { data: streaks } = await supabase.rpc('get_streaks');
  const { data: graph } = await supabase.rpc('get_past_ten_daily_games');
  const { data: c } = await supabase.auth.getClaims();

  const user = c?.claims;

  const { data: profile } = await supabase
      .from("users")
      .select("display_name, username, is_admin")
      .eq("id", user?.sub)
      .single();

  if (profile?.is_admin) {
    return (
        <div className="flex flex-col gap-8 p-6 md:p-10">

          {/* Header */}
          <header className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
              Admin Panel
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Analytics Overview
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Core engagement metrics to understand user activity, retention, and game performance.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="rounded-2xl border border-border/30 bg-card p-6 flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Daily Active Users</h2>
              <p id="active_users" className="text-3xl font-bold">{daily_active_users}</p>
              <p className="text-sm text-muted-foreground">
                Unique users who have played a game in the last 24 hours.
              </p>
            </div>

            <div className="rounded-2xl border border-border/30 bg-card p-6 flex flex-col gap-3">
              <h2 className="text-lg font-semibold">User Streaks</h2>
              <p id="streaks" className="text-3xl font-bold">{streaks}</p>
              <p className="text-sm text-muted-foreground">
                Tracks how many consecutive days users play at least one game.
              </p>
            </div>

            <div className="rounded-2xl border border-border/30 bg-card p-6 flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Games Played</h2>
              <p id="daily_games" className="text-3xl font-bold">{daily_games_played}</p>
              <p className="text-sm text-muted-foreground">
                Total number of completed games across the platform in a 24-hour period.
              </p>
            </div>

          </section>

          <section className="rounded-2xl border border-dashed border-border/40 bg-card p-6">
            <h2 className="text-2xl font-semibold">Games Played Chart</h2>

            <div className="mt-6 h-60 flex items-center justify-center text-muted-foreground text-sm">
              <LineChart data={graph} />
            </div>
          </section>

        </div>
    )
  }
  return (<div>HTTP 403 Forbidden</div>);
}

export default function AdminPanel() {
  return (
      <Suspense fallback={<></>}>
        <Dashboard/>
      </Suspense>
  );
}
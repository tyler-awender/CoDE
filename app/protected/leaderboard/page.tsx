import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";

type GameOption = {
  value: string;
  label: string;
};

type GameMetrics = {
  plays: number;
  unique_players: number;
  top_score: number;
};

type LeaderboardEntry = {
  rank: number;
  display_name: string;
  username: string;
  avg_score: string;
  plays: number;
};

const GAME_OPTIONS: GameOption[] = [
  { value: "higher-lower", label: "GitHub Higher/Lower" },
  { value: "scrambled-algs", label: "Scrambled Algorithms" },
  { value: "truth-table-wordle", label: "Truth Table Wordle" },
  { value: "guess-the-prog-lang", label: "Guess the Programming Language" },
];

function isGameOption(value: string): value is (typeof GAME_OPTIONS)[number]["value"] {
  return GAME_OPTIONS.some((option) => option.value === value);
}

function getSafeGame(searchValue: string | undefined) {
  if (searchValue && isGameOption(searchValue)) {
    return searchValue;
  }

  return GAME_OPTIONS[0].value;
}

async function LeaderboardContent({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>;
}) {
  const params = await searchParams;
  const selectedGame = getSafeGame(params.game);
  const selectedGameLabel =
    GAME_OPTIONS.find((game) => game.value === selectedGame)?.label ??
    GAME_OPTIONS[0].label;

  const supabase = await createClient();

  const [{ data: gameMetricsData }, { data: leaderboardData }] = await Promise.all([
    supabase.rpc("get_game_metrics", { game_name: selectedGame }),
    supabase.rpc("get_game_leaderboard", {
      game_name: selectedGame,
      p_limit: 10,
    }),
  ]);

  const gameMetrics: GameMetrics = gameMetricsData?.[0] ?? {
    plays: 0,
    unique_players: 0,
    top_score: 0,
  };

  const leaderboard: LeaderboardEntry[] = leaderboardData ?? [];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/70">
          Leaderboard
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Game Rankings
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Game-specific rankings based on each player&apos;s average score.
        </p>
      </header>

      <section className="rounded-2xl border border-border/30 bg-card p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary/70">
          Choose game
        </p>
        <div className="flex flex-wrap gap-2">
          {GAME_OPTIONS.map((game) => {
            const isActive = game.value === selectedGame;

            return (
              <Link
                key={game.value}
                href={`/protected/leaderboard?game=${game.value}`}
                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-border/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {game.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-border/30 bg-card p-6">
          <h2 className="text-lg font-semibold">Total Plays</h2>
          <p className="text-3xl font-bold">{gameMetrics.plays}</p>
          <p className="text-sm text-muted-foreground">
            Completed runs for <b>{selectedGameLabel}</b>.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/30 bg-card p-6">
          <h2 className="text-lg font-semibold">Unique Players</h2>
          <p className="text-3xl font-bold">{gameMetrics.unique_players}</p>
          <p className="text-sm text-muted-foreground">
            Distinct users who have played this game.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/30 bg-card p-6">
          <h2 className="text-lg font-semibold">Top Score</h2>
          <p className="text-3xl font-bold">{gameMetrics.top_score}</p>
          <p className="text-sm text-muted-foreground">
            Best score recorded for this game.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-border/40 bg-card p-6">
        <h2 className="text-2xl font-semibold">Top Players</h2>

        {leaderboard.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No game entries yet for {selectedGameLabel}.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border/40 text-muted-foreground">
                  <th className="px-3 py-2 font-bold">Rank</th>
                  <th className="px-3 py-2 font-bold">Display Name</th>
                  <th className="px-3 py-2 font-bold">Username</th>
                  <th className="px-3 py-2 font-bold">Average Score</th>
                  <th className="px-3 py-2 font-bold">Plays</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr
                    key={`${entry.rank}-${entry.username}-${entry.display_name}`}
                    className="border-b border-border/20 last:border-b-0 odd:bg-muted/20 even:bg-transparent"
                  >
                    <td className="px-3 py-3 font-medium text-muted-foreground">#{entry.rank}</td>
                    <td className="px-3 py-3 font-semibold text-primary">{entry.display_name}</td>
                    <td className="px-3 py-3 font-medium">
                      {entry.username || "-"}
                    </td>
                    <td className="px-3 py-3 font-bold">{entry.avg_score}</td>
                    <td className="px-3 py-3 font-semibold">{entry.plays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground md:p-10">Loading leaderboard...</div>}>
      <LeaderboardContent searchParams={searchParams} />
    </Suspense>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-border/30 bg-card/60 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          Leaderboard
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          Leaderboards are the next stop
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          This route now exists on its own, so navigation no longer falls back
          to the generic protected placeholder page.
        </p>
      </section>

      <section className="rounded-xl border border-dashed border-border/40 bg-card p-6">
        <p className="text-foreground">
          Score aggregation and rankings have not been connected yet, but this
          page is ready for that work.
        </p>
      </section>
    </div>
  );
}

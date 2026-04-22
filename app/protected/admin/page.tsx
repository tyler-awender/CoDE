export default function AdminPanel() {
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
          <p className="text-3xl font-bold">—</p>
          <p className="text-sm text-muted-foreground">
            Unique users who visited the site in the last 24 hours.
          </p>
        </div>

        <div className="rounded-2xl border border-border/30 bg-card p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">User Streaks</h2>
          <p className="text-3xl font-bold">—</p>
          <p className="text-sm text-muted-foreground">
            Tracks how many consecutive days users play at least one game.
          </p>
        </div>

        <div className="rounded-2xl border border-border/30 bg-card p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Games Played</h2>
          <p className="text-3xl font-bold">—</p>
          <p className="text-sm text-muted-foreground">
            Total number of completed games across the platform in a 24-hour period.
          </p>
        </div>

      </section>

      <section className="rounded-2xl border border-dashed border-border/40 bg-card p-6">
        <h2 className="text-lg font-semibold">Trends</h2>
        <p className="text-sm text-muted-foreground mt-2">
          This section graphs DAU, streak distribution, and games played over time.
        </p>

        <div className="mt-6 h-40 flex items-center justify-center text-muted-foreground text-sm">
          placeholder
        </div>
      </section>

    </div>
  );
}
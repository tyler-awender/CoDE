import Link from "next/link";

export default function GamesPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-border/30 bg-card/60 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          Games
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          Pick your next game
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Choose a game and start playing.
        </p>
      </section>

      <Link
        href="/games/higher-lower"
        className="rounded-xl border border-border/30 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          Available Now
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          GitHub Higher/Lower
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Compare two repositories and guess which one has more stars.
        </p>
      </Link>

      <Link
        href="/games/scrambled-algorithm"
        className="rounded-xl border border-border/30 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          Available Now
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Scrambled Algorithm
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Put algorithm steps in the correct order.
        </p>
      </Link>
    </div>
  );
}
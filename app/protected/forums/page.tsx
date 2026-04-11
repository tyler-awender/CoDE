export default function ForumsPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-border/30 bg-card/60 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          Forums
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          Community space coming soon
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          The app now has a dedicated forums route instead of sending users to
          the generic auth test page.
        </p>
      </section>

      <section className="rounded-xl border border-dashed border-border/40 bg-card p-6">
        <p className="text-foreground">
          Discussion threads and social features can be added here when you are
          ready.
        </p>
      </section>
    </div>
  );
}

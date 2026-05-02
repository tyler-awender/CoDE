import Link from "next/link";
import { Gamepad2, MessageSquare, Trophy, User } from "lucide-react";

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-border/30 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
        <Icon
          size={24}
          className="text-primary transition-transform group-hover:scale-110"
        />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-10">
      <section className="rounded-2xl border border-border/30 bg-card/60 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          Welcome back to <span className="text-primary">CoDE</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          You've successfully signed in. Pick a destination below to jump into a game,
          view your profile, or check the leaderboards.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <QuickLink
          href="/protected/games"
          icon={Gamepad2}
          title="Games"
          description="Browse playable games and dive right into the fun."
        />
        <QuickLink
          href="/protected/profile"
          icon={User}
          title="Profile"
          description="View and change your account details."
        />
        <QuickLink
          href="/protected/leaderboard"
          icon={Trophy}
          title="Leaderboards"
          description="See where you stand amongst other players."
        />
        <QuickLink
          href="/protected/forums"
          icon={MessageSquare}
          title="Forums"
          description="Share your thoughts with the community."
        />
      </section>
    </div>
  );
}

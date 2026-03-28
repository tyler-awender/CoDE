import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Gamepad2, User, Trophy, MessageSquare } from "lucide-react";

function FeatureCard({
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
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-5 py-20">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Welcome to{" "}
            <span className="text-primary">CoDE</span>
          </h1>
          <p className="mt-2 text-lg text-primary/80 font-medium">
            Cove of Delightful Entertainment
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Dive into an ocean of fun. Track your scores, climb the
            leaderboard, and compete with friends.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="mt-16 w-full max-w-xl">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="w-full max-w-6xl mx-auto px-5 pb-20">
        <h2 className="mb-8 text-center text-2xl font-semibold text-foreground">
          Explore the Cove
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            href="/protected"
            icon={Gamepad2}
            title="Games"
            description="Play our games."
          />
          <FeatureCard
            href="/protected"
            icon={User}
            title="Profile"
            description="View your stats, customize your display name, and track your personal gaming metrics."
          />
          <FeatureCard
            href="/protected"
            icon={Trophy}
            title="Leaderboard"
            description="See how you stack up against other players. Compete for the top spot on the leaderboard."
          />
          <FeatureCard
            href="/protected"
            icon={MessageSquare}
            title="Forums"
            description="Join the community discussion. Share strategies and connect with fellow gamers."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/30 py-8">
        <div className="mx-auto max-w-6xl px-5 flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>CoDE - Cove of Delightful Entertainment</p>
          <p>CS 160, Section 02, Spring 2026 - Team #7</p>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";

export function Navbar() {
  return (
    <nav className="w-full border-b border-border/30 bg-card/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-16 px-5">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-primary hover:opacity-80 transition-opacity"
        >
          CoDE
        </Link>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/protected/games"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Games
          </Link>
          <Link
            href="/protected/profile"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/protected/leaderboard"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Leaderboard
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
      </div>
    </nav>
  );
}

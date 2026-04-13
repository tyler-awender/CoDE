import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = "";

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id)
      .single();

    username = profile?.username ?? "";
  }

  return (
    <nav className="w-full border-b border-border/30 bg-card/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-16 px-5">
        <Link
          href="/protected"
          className="text-xl font-bold tracking-wide text-primary hover:opacity-80 transition-opacity"
        >
          CoDE
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-sm">
          <Link
            href="/protected"
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

        <div className="flex items-center gap-3">
          {user && <span className="text-sm">Hi @{username}</span>}

          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
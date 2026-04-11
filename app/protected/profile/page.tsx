import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data.claims;

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-border/30 bg-card/60 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          Profile
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          Account overview
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          This page is wired to your authenticated session, so it can be
          expanded later with stats, preferences, and saved progress.
        </p>
      </section>

      <section className="rounded-xl border border-border/30 bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground">Current user</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/30 bg-background/40 p-4">
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="mt-1 text-base font-medium text-foreground">
              {user.email ?? "Unavailable"}
            </dd>
          </div>
          <div className="rounded-lg border border-border/30 bg-background/40 p-4">
            <dt className="text-sm text-muted-foreground">User ID</dt>
            <dd className="mt-1 break-all text-base font-medium text-foreground">
              {user.sub}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

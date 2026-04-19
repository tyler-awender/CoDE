import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditDisplayNameForm from "@/components/edit-display-name-form";

function ProfileFallback() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-border/30 bg-card/60 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
          Profile
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          Account overview
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Loading...</p>
      </section>
    </div>
  );
}

async function ProfileContent() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const user = data.claims;

  const { data: profile } = await supabase
    .from("users")
    .select("display_name, username, created_at")
    .eq("id", user.sub)
    .single();

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "Unavailable";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
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

      {/* User Info */}
      <section className="rounded-2xl border border-border/30 bg-card p-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Current user
        </h2>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border/30 bg-background/40 p-6">
            <dt className="text-sm text-muted-foreground">Display Name</dt>
            <dd className="mt-3 text-base font-medium text-foreground">
              {profile?.display_name ?? "Not set"}
            </dd>
          </div>

          <div className="rounded-xl border border-border/30 bg-background/40 p-6">
            <dt className="text-sm text-muted-foreground">Username</dt>
            <dd className="mt-3 text-base font-medium text-foreground">
              {profile?.username ? `@${profile.username}` : "Not set"}
            </dd>
          </div>

          <div className="rounded-xl border border-border/30 bg-background/40 p-6">
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="mt-3 break-all text-base font-medium text-foreground">
              {user.email ?? "Unavailable"}
            </dd>
          </div>

          <div className="rounded-xl border border-border/30 bg-background/40 p-6">
            <dt className="text-sm text-muted-foreground">Joined</dt>
            <dd className="mt-3 text-base font-medium text-foreground">
              {joinedDate}
            </dd>
          </div>
        </dl>
      </section>

      {/* Edit Display Name */}
      <section className="rounded-2xl border border-border/30 bg-card p-8">
        <h2 className="text-2xl font-semibold text-foreground">
          Edit display name
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Update how your name appears on your profile.
        </p>

        <div className="mt-3">
          <EditDisplayNameForm
            currentDisplayName={profile?.display_name ?? ""}
          />
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfileContent />
    </Suspense>
  );
}


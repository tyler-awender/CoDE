import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditDisplayNameForm from "@/components/edit-display-name-form";

function ProfileFallback() {
  return (
    <section className="px-6 py-10 text-white">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-slate-400 mt-2">Loading profile...</p>
      </div>
    </section>
  );
}

async function ProfileContent() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, username, display_name, email, created_at")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/auth/login");
  }

  const { data: metrics } = await supabase
    .from("metrics")
    .select("score, streak, games_played")
    .eq("user_id", user.id);

  const rows = metrics ?? [];

  const totalGames = rows.reduce(
    (sum, item) => sum + (item.games_played ?? 1),
    0
  );

  const bestScore =
    rows.length > 0 ? Math.max(...rows.map((m) => m.score ?? 0)) : 0;

  const streak =
    rows.length > 0 ? Math.max(...rows.map((m) => m.streak ?? 0)) : 0;

  return (
    <section className="px-6 py-10 text-white">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-slate-400 mt-2">
          View your profile and game stats
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-4">{profile.display_name}</h2>

        <div className="space-y-2 text-slate-300">
          <p>
            <span className="font-semibold text-white">Username:</span> @{profile.username}
          </p>
          <p>
            <span className="font-semibold text-white">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold text-white">Display Name:</span> {profile.display_name}
          </p>
          <p>
            <span className="font-semibold text-white">Joined At:</span>{" "}
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-6">
          <EditDisplayNameForm
            userId={profile.id}
            currentDisplayName={profile.display_name}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="bg-slate-900 shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-bold text-teal-400">{bestScore}</h2>
          <p className="text-slate-400 mt-1">Best Score</p>
        </div>

        <div className="bg-slate-900 shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-bold text-teal-400">{streak}</h2>
          <p className="text-slate-400 mt-1">Streak</p>
        </div>

        <div className="bg-slate-900 shadow rounded-xl p-6 text-center">
          <h2 className="text-3xl font-bold text-teal-400">{totalGames}</h2>
          <p className="text-slate-400 mt-1">Games Played</p>
        </div>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFallback />}>
      <ProfileContent />
    </Suspense>
  );
}
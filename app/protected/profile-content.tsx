import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditDisplayNameForm from "@/components/edit-display-name-form";

export default async function ProfileContent() {
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
    .select("id, username, display_name, email, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/auth/login");
  }

  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid gap-4 mb-8">
        <div>
          <p className="text-sm text-slate-400">Display Name</p>
          <p className="text-lg font-semibold">{profile.display_name}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Username</p>
          <p className="text-lg font-semibold">@{profile.username}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Email</p>
          <p className="text-lg font-semibold break-all">{profile.email}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Joined</p>
          <p className="text-lg font-semibold">
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <EditDisplayNameForm
        userId={profile.id}
        currentDisplayName={profile.display_name}
      />
    </div>
  );
}

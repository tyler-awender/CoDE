import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EditDisplayNameForm from "@/components/edit-display-name-form";

export default async function ProfilePage() {
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="w-full border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/protected" className="text-2xl font-bold">
            CoDE
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/protected" className="hover:text-teal-400">
              Home
            </Link>
            <Link href="/profile" className="hover:text-teal-400">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
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
      </div>
    </main>
  );
}

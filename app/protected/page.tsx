import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, username, display_name, email")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="w-full border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/protected" className="text-2xl font-bold">
            CoDE
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/protected">Home</Link>
            <Link href="/profile">Profile</Link>
          </div>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to CoDE</h1>
        <p className="text-xl text-slate-300 mb-10">Choose your game</p>

        {profile && (
          <p className="text-lg">
            Hi {profile.display_name} (@{profile.username})
          </p>
        )}
      </section>
    </main>
  );
}

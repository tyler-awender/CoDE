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
    .select("display_name, username")
    .eq("id", user.id)
    .single();

  return (
    <section className="px-6 py-16 text-center text-white">
      <h1 className="text-5xl font-extrabold mb-4">Welcome to CoDE</h1>

      <p className="text-xl text-slate-300 mb-3">
        {profile ? `Hello ${profile.display_name}` : "Play games and track your progress"}
      </p>

      {profile && (
        <p className="text-slate-400 mb-10">Username: @{profile.username}</p>
      )}

      {/* GAME BOX */}
      <div className="bg-slate-900 rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Play Games</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/games/truth-table"
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-lg font-semibold transition"
          >
            Truth Table
          </Link>

          <Link
            href="/games/higher-lower"
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-lg font-semibold transition"
          >
            High-Low
          </Link>

          <Link
            href="/games/scrambled-algorithm"
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-lg font-semibold transition"
          >
            Scrambled Algorithm
          </Link>

          <Link
            href="/games/guess-the-programming-language"
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-lg font-semibold transition"
          >
            Guess the Programming Language
          </Link>
        </div>
      </div>
    </section>
  );
}
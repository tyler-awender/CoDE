import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <nav className="w-full border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">CoDE</h1>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-5xl font-extrabold mb-6">Welcome to CoDE</h2>
          <p className="text-lg text-slate-300 mb-8">
            Cove of Delightful Entertainment — a platform with fun daily
            games to improve logic and coding skills.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

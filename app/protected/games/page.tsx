import Link from "next/link";

export default function GamesPage() {
  return (
    <section className="px-6 py-10 text-white">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Games</h1>
        <p className="text-slate-400 mt-2">
          Choose a game to start playing
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-lg p-8 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/games/truth-table"
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-lg font-semibold transition text-center"
          >
            Truth Table
          </Link>

          <Link
            href="/games/higher-lower"
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-lg font-semibold transition text-center"
          >
            High-Low
          </Link>

          <Link
            href="/games/scrambled-algorithm"
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-lg font-semibold transition text-center"
          >
            Scrambled Algorithm
          </Link>

          <Link
            href="/games/guess-the-programming-language"
            className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-lg font-semibold transition text-center"
          >
            Guess the Programming Language
          </Link>
        </div>
      </div>
    </section>
  );
}
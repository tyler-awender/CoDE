import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { TruthTableWordle } from "@/components/games/truth-table-wordle";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="mx-auto flex w-full max-w-[min(80rem,80vw)] flex-1 flex-col py-10">
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center gap-6">
              <h2 className="mb-4 bg-gradient-to-r from-[hsl(192,75%,51%)] to-[hsl(166,52%,58%)] bg-clip-text text-4xl font-bold text-transparent">
                Truth Table Wordle
              </h2>

              <Suspense
                fallback={
                  <div className="h-64 w-full max-w-2xl animate-pulse rounded-xl bg-muted/40" />
                }
              >
                <TruthTableWordle />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-border/30 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>CoDE - Cove of Delightful Entertainment</p>
          <p>CS 160, Section 02, Spring 2026 - Team #7</p>
        </div>
      </footer>
    </main>
  );
}

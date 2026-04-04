import { Navbar } from "@/components/navbar";
import { HigherLower } from "@/components/games/higher-lower";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-[min(80rem,80vw)] mx-auto py-10 flex flex-col">
        <div className="flex flex-col flex-1 gap-8">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 gap-6 items-center">
              <h2 className="font-bold text-4xl mb-4 text-primary bg-gradient-to-r from-[hsl(187,72%,42%)] to-[hsl(226,80%,52%)] bg-clip-text text-transparent">
                GitHub Higher/Lower
              </h2>
              <HigherLower />
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full border-t border-border/30 py-8">
        <div className="mx-auto max-w-6xl px-5 flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>CoDE - Cove of Delightful Entertainment</p>
          <p>CS 160, Section 02, Spring 2026 - Team #7</p>
        </div>
      </footer>
    </main>
  );
}
import { Navbar } from "@/components/navbar";
import { GuessLanguage } from "@/components/games/guess-language";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-[min(84rem,88vw)] mx-auto py-10 flex flex-col">
        <div className="flex flex-col flex-1 gap-8">
          <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 gap-6 items-center">
              <h2 className="font-bold text-center text-4xl mb-4 text-primary bg-gradient-to-r from-[hsl(184,72%,47%)] via-[hsl(207,82%,55%)] to-[hsl(24,86%,55%)] bg-clip-text text-transparent">
                Guess the Programming Language
              </h2>
              <GuessLanguage />
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

"use client";

import { useMemo, useState } from "react";
import { Binary, Flame } from "lucide-react";

import { createGameEntry } from "@/lib/create-game-entry";

import styles from "./guess-language.module.css";

type LanguageQuestion = {
  id: number;
  language: string;
  prompt: string;
  snippet: string;
  choices: string[];
  accent: string;
};

const QUESTIONS: LanguageQuestion[] = [
  {
    id: 1,
    language: "Python",
    prompt: "Which language is this data-cleaning helper written in?",
    snippet: `def normalize_names(values):
    return [value.strip().title() for value in values if value]`,
    choices: ["Python", "Ruby", "Lua", "Julia"],
    accent: "from-[hsl(188,77%,45%)] to-[hsl(224,84%,54%)]",
  },
  {
    id: 2,
    language: "JavaScript",
    prompt: "Which language powers this small async UI helper?",
    snippet: `const loadProfile = async (id) => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};`,
    choices: ["TypeScript", "JavaScript", "C#", "Go"],
    accent: "from-[hsl(44,92%,55%)] to-[hsl(24,85%,53%)]",
  },
  {
    id: 3,
    language: "Rust",
    prompt: "Which language does this result-based parsing function use?",
    snippet: `fn parse_port(value: &str) -> Result<u16, String> {
    value.parse::<u16>().map_err(|_| "invalid port".to_string())
}`,
    choices: ["Rust", "C++", "Swift", "Kotlin"],
    accent: "from-[hsl(16,85%,48%)] to-[hsl(345,78%,42%)]",
  },
  {
    id: 4,
    language: "SQL",
    prompt: "What language is querying player score totals here?",
    snippet: `select username, sum(score) as total_score
from game_results
group by username
order by total_score desc;`,
    choices: ["GraphQL", "SQL", "Bash", "R"],
    accent: "from-[hsl(169,72%,40%)] to-[hsl(203,78%,47%)]",
  },
  {
    id: 5,
    language: "TypeScript",
    prompt: "Which language is this typed leaderboard model using?",
    snippet: `type LeaderboardEntry = {
  username: string;
  wins: number;
  lastPlayed?: string;
};`,
    choices: ["Java", "TypeScript", "PHP", "Scala"],
    accent: "from-[hsl(212,82%,47%)] to-[hsl(191,78%,45%)]",
  },
  {
    id: 6,
    language: "Go",
    prompt: "Which language is behind this API health check?",
    snippet: `func healthcheck() string {
    return "service ready"
}`,
    choices: ["Go", "C", "JavaScript", "Elixir"],
    accent: "from-[hsl(191,84%,52%)] to-[hsl(167,74%,42%)]",
  },
  {
    id: 7,
    language: "Java",
    prompt: "Which language does this object-oriented greeting method use?",
    snippet: `public class Greeter {
    public String greet(String name) {
        return "Hello, " + name;
    }
}`,
    choices: ["C#", "Java", "Kotlin", "Dart"],
    accent: "from-[hsl(24,88%,50%)] to-[hsl(8,81%,46%)]",
  },
  {
    id: 8,
    language: "Ruby",
    prompt: "Which language is this compact scoring helper from?",
    snippet: `scores = players.map { |player| player[:wins] }
puts scores.max`,
    choices: ["Ruby", "Perl", "Python", "Haskell"],
    accent: "from-[hsl(349,78%,48%)] to-[hsl(12,82%,44%)]",
  },
];

export function GuessLanguage() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [scorePop, setScorePop] = useState(false);

  const question = QUESTIONS[index];
  const progress = useMemo(
    () => ((index + (finished ? 1 : 0)) / QUESTIONS.length) * 100,
    [finished, index],
  );

  const resetGame = () => {
    setStarted(false);
    setIndex(0);
    setScore(0);
    setBestStreak(0);
    setCurrentStreak(0);
    setSelectedChoice(null);
    setRevealed(false);
    setFinished(false);
    setScorePop(false);
  };

  const beginGame = () => {
    setStarted(true);
    setIndex(0);
    setScore(0);
    setBestStreak(0);
    setCurrentStreak(0);
    setSelectedChoice(null);
    setRevealed(false);
    setFinished(false);
  };

  const handleChoice = (choice: string) => {
    if (revealed) {
      return;
    }

    const isCorrect = choice === question.language;
    const nextStreak = isCorrect ? currentStreak + 1 : 0;

    setSelectedChoice(choice);
    setRevealed(true);
    setCurrentStreak(nextStreak);
    setBestStreak((currentBest) => Math.max(currentBest, nextStreak));

    if (isCorrect) {
      setScore((currentScore) => currentScore + 1);
      setScorePop(true);
      setTimeout(() => setScorePop(false), 380);
    }

    window.setTimeout(() => {
      const isLastQuestion = index === QUESTIONS.length - 1;

      if (isLastQuestion) {
        setFinished(true);
        createGameEntry('guess-the-prog-lang', score);
        return;
      }

      setIndex((currentIndex) => currentIndex + 1);
      setSelectedChoice(null);
      setRevealed(false);
    }, 1100);
  };

  if (!started) {
    return (
      <div className="flex-1 grid place-items-center rounded-md border border-border bg-card text-muted-foreground overflow-auto w-full">
        <div
          className="flex max-w-2xl flex-col items-center justify-center gap-6 rounded-xl border border-border p-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(162, 81%, 34%) 0%, hsl(224, 86%, 32%) 100%)",
            boxShadow: "0 0 80px hsl(249, 87%, 27%)",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <h3
              className="text-4xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to right, hsl(181, 80%, 62%), hsl(207, 84%, 68%))",
              }}
            >
              Guess the Programming Language
            </h3>
            <p className="max-w-xl text-base font-medium text-card-foreground">
              Read the snippet and identify the language.
            </p>
          </div>

          <button
            onClick={beginGame}
            className="rounded-md bg-gradient-to-r from-[hsl(199,60%,50%)] to-[hsl(166,80%,38%)] px-8 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const accuracy = Math.round((score / QUESTIONS.length) * 100);

    return (
      <div className="flex-1 grid place-items-center rounded-md border border-border bg-card text-muted-foreground overflow-auto w-full p-6">
        <div
          className={`${styles.summary_panel} flex w-full max-w-2xl flex-col gap-8 rounded-2xl border border-border p-8`}
          style={{
            background:
              "linear-gradient(135deg, hsl(162,81%,34%) 0%, hsl(224,86%,32%) 100%)",
            boxShadow: "0 0 80px hsl(249,87%,27%)",
          }}
        >
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-white/55">
              Challenge Complete
            </p>
            <h3
              className="mt-3 text-4xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to right, hsl(181, 80%, 62%), hsl(207, 84%, 68%))",
              }}
            >
              Language Locked In
            </h3>
            <p className="mt-4 text-white/80">
              You finished all {QUESTIONS.length} rounds. Here is how the run
              went.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-black/15 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                Score
              </p>
              <p className="mt-2 text-4xl font-bold text-white">{score}</p>
            </div>
            <div className="rounded-xl bg-black/15 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                Accuracy
              </p>
              <p className="mt-2 text-4xl font-bold text-white">{accuracy}%</p>
            </div>
            <div className="rounded-xl bg-black/15 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">
                Best Streak
              </p>
              <p className="mt-2 text-4xl font-bold text-white">{bestStreak}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={beginGame}
              className="rounded-md bg-gradient-to-r from-[hsl(199,60%,50%)] to-[hsl(166,80%,38%)] px-8 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
            >
              Play Again
            </button>
            <button
              onClick={resetGame}
              className="rounded-md border border-white/20 bg-white/10 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/15"
            >
              Back to Intro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card text-muted-foreground overflow-hidden w-full">
      <div className="grid h-full gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col border-b border-border/50 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.1),transparent_38%),linear-gradient(180deg,rgba(6,23,38,0.98),rgba(8,18,31,0.96))] p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary/80">
                Round {index + 1} of {QUESTIONS.length}
              </p>
              <h3 className="mt-2 text-3xl font-bold text-white">
                Guess the Language
              </h3>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(181,80%,62%)] to-[hsl(207,84%,68%)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={`${styles.question_shell} mt-6 flex flex-1 flex-col`}>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Prompt
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold text-white">
                    {question.prompt}
                  </h4>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-950/80">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <Binary className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs uppercase tracking-[0.25em] text-white/45">
                    Source
                  </span>
                </div>
                <pre className="overflow-x-auto px-4 py-5 font-mono text-sm leading-7 text-cyan-50">
                  <code>{question.snippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex flex-col justify-between bg-[linear-gradient(180deg,rgba(249,115,22,0.12),rgba(12,18,32,0.94)_22%,rgba(17,24,39,0.98))] p-6">
          <div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Score
                </p>
                <p
                  className={`mt-2 text-4xl font-bold text-white ${scorePop ? styles.score_pop : ""}`}
                >
                  {score}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Streak
                </p>
                <div className="mt-2 flex items-center gap-2 text-white">
                  <Flame className="h-5 w-5 text-orange-300" />
                  <span className="text-3xl font-bold">{currentStreak}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Progress
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {index + 1}/{QUESTIONS.length}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {question.choices.map((choice) => {
                const isCorrect = choice === question.language;
                const isSelected = choice === selectedChoice;

                let stateClasses =
                  "border-white/10 bg-white/5 text-white hover:border-cyan-300/60 hover:bg-white/10";

                if (revealed && isCorrect) {
                  stateClasses =
                    "border-emerald-300/60 bg-emerald-400/15 text-white";
                } else if (revealed && isSelected && !isCorrect) {
                  stateClasses = "border-rose-300/60 bg-rose-400/15 text-white";
                }

                return (
                  <button
                    key={choice}
                    onClick={() => handleChoice(choice)}
                    disabled={revealed}
                    className={`${isCorrect && revealed ? styles.correct_flash : ""} rounded-2xl border p-4 text-left transition-all duration-200 ${stateClasses}`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Choice
                    </p>
                    <p className="mt-2 text-xl font-semibold">{choice}</p>
                    {revealed && (
                      <p className="mt-1 text-sm text-white/65">
                        {isCorrect
                          ? "Correct answer"
                          : isSelected
                            ? "Incorrect answer"
                            : ""}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

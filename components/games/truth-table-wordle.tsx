"use client";

import { useEffect, useState } from "react";

type Row = {
  A: boolean;
  B: boolean;
  result: boolean;
};

type Puzzle = {
  expression: string;
  hint: string;
  table: Row[];
};

const PUZZLES: Puzzle[] = [
  {
    expression: "A AND B",
    hint: "True only when both A and B are true.",
    table: [
      { A: false, B: false, result: false },
      { A: false, B: true, result: false },
      { A: true, B: false, result: false },
      { A: true, B: true, result: true },
    ],
  },
  {
    expression: "A OR B",
    hint: "True when at least one input is true.",
    table: [
      { A: false, B: false, result: false },
      { A: false, B: true, result: true },
      { A: true, B: false, result: true },
      { A: true, B: true, result: true },
    ],
  },
  {
    expression: "A XOR B",
    hint: "True when the inputs are different.",
    table: [
      { A: false, B: false, result: false },
      { A: false, B: true, result: true },
      { A: true, B: false, result: true },
      { A: true, B: true, result: false },
    ],
  },
  {
    expression: "NOT A",
    hint: "Only depends on A.",
    table: [
      { A: false, B: false, result: true },
      { A: false, B: true, result: true },
      { A: true, B: false, result: false },
      { A: true, B: true, result: false },
    ],
  },
  {
    expression: "A NAND B",
    hint: "The opposite of AND.",
    table: [
      { A: false, B: false, result: true },
      { A: false, B: true, result: true },
      { A: true, B: false, result: true },
      { A: true, B: true, result: false },
    ],
  },
  {
    expression: "A NOR B",
    hint: "The opposite of OR.",
    table: [
      { A: false, B: false, result: true },
      { A: false, B: true, result: false },
      { A: true, B: false, result: false },
      { A: true, B: true, result: false },
    ],
  },
];

const VALID_GUESSES = [
  "A AND B",
  "A OR B",
  "A XOR B",
  "NOT A",
  "A NAND B",
  "A NOR B",
];

function normalizeGuess(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, " ");
}

function getGuessStatus(guess: string, answer: string) {
  if (guess === answer) return "correct";
  if (guess.includes("AND") && answer.includes("AND")) return "close";
  if (guess.includes("OR") && answer.includes("OR")) return "close";
  if (guess.includes("NOT") && answer.includes("NOT")) return "close";
  if (guess.includes("XOR") && answer.includes("XOR")) return "close";
  if (guess.includes("NAND") && answer.includes("NAND")) return "close";
  if (guess.includes("NOR") && answer.includes("NOR")) return "close";
  return "wrong";
}

function getRandomPuzzle() {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
}

export function TruthTableWordle() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const maxGuesses = 6;

  useEffect(() => {
    setPuzzle(getRandomPuzzle());
  }, []);

  const submitGuess = () => {
    if (!puzzle || gameOver) return;

    const normalized = normalizeGuess(guess);

    if (!normalized) {
      setMessage("Please enter a guess.");
      return;
    }

    if (!VALID_GUESSES.includes(normalized)) {
      setMessage(
        "Try one of these: A AND B, A OR B, A XOR B, NOT A, A NAND B, A NOR B"
      );
      return;
    }

    if (guesses.includes(normalized)) {
      setMessage("You already guessed that.");
      return;
    }

    const nextGuesses = [...guesses, normalized];
    setGuesses(nextGuesses);
    setGuess("");
    setMessage("");

    if (normalized === puzzle.expression) {
      setWon(true);
      setGameOver(true);
      setMessage("Correct! You solved it.");
      return;
    }

    if (nextGuesses.length >= maxGuesses) {
      setWon(false);
      setGameOver(true);
      setMessage(`Game over. The answer was ${puzzle.expression}.`);
    }
  };

  const resetGame = () => {
    setPuzzle(getRandomPuzzle());
    setGuess("");
    setGuesses([]);
    setMessage("");
    setGameOver(false);
    setWon(false);
  };

  if (!puzzle) {
    return (
      <div className="w-full max-w-5xl rounded-2xl border border-border/30 bg-card p-6 shadow-lg">
        <p className="text-sm text-muted-foreground">Loading game...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl rounded-2xl border border-border/30 bg-card p-6 shadow-lg">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/30 bg-background/40 p-5">
          <h3 className="mb-2 text-2xl font-semibold text-foreground">
            Hidden Truth Table
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Guess the hidden boolean expression from the output column.
          </p>

          <div className="overflow-hidden rounded-xl border border-border/30">
            <table className="w-full text-center">
              <thead className="bg-background/60">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">A</th>
                  <th className="px-4 py-3 text-sm font-semibold">B</th>
                  <th className="px-4 py-3 text-sm font-semibold">Output</th>
                </tr>
              </thead>
              <tbody>
                {puzzle.table.map((row, index) => (
                  <tr key={index} className="border-t border-border/20">
                    <td className="px-4 py-3">{row.A ? "T" : "F"}</td>
                    <td className="px-4 py-3">{row.B ? "T" : "F"}</td>
                    <td className="px-4 py-3 font-bold text-primary">
                      {row.result ? "T" : "F"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl bg-background/50 p-4">
            <p className="text-sm font-medium text-foreground">Hint</p>
            <p className="mt-1 text-sm text-muted-foreground">{puzzle.hint}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/30 bg-background/40 p-5">
          <h3 className="mb-2 text-2xl font-semibold text-foreground">
            Your Guesses
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            You have {maxGuesses - guesses.length} guesses left.
          </p>

          <div className="mb-5 space-y-3">
            {Array.from({ length: maxGuesses }).map((_, index) => {
              const currentGuess = guesses[index];
              const status = currentGuess
                ? getGuessStatus(currentGuess, puzzle.expression)
                : "empty";

              const statusStyles =
                status === "correct"
                  ? "border-green-500 bg-green-500/15 text-green-300"
                  : status === "close"
                  ? "border-yellow-500 bg-yellow-500/15 text-yellow-300"
                  : status === "wrong"
                  ? "border-red-500 bg-red-500/15 text-red-300"
                  : "border-border/30 bg-background/40 text-muted-foreground";

              return (
                <div
                  key={index}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium ${statusStyles}`}
                >
                  {currentGuess || "Empty guess"}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitGuess();
              }}
              placeholder="Example: A AND B"
              className="w-full rounded-xl border border-border/30 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
              disabled={gameOver}
            />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={submitGuess}
                disabled={gameOver}
                className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Guess
              </button>

              <button
                onClick={resetGame}
                className="rounded-xl border border-border/30 px-5 py-3 font-semibold text-foreground transition hover:bg-background/60"
              >
                New Game
              </button>
            </div>

            {message && (
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            )}

            <div className="mt-4 rounded-xl bg-background/50 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">
                Valid guesses
              </p>
              <p className="text-sm text-muted-foreground">
                A AND B, A OR B, A XOR B, NOT A, A NAND B, A NOR B
              </p>
            </div>
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border/30 bg-card p-8 text-center shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold text-primary">
              {won ? "You Win!" : "Game Over"}
            </h2>

            <p className="mb-2 text-lg text-foreground">
              Answer: <span className="font-bold">{puzzle.expression}</span>
            </p>

            <p className="mb-6 text-sm text-muted-foreground">
              {won
                ? "Nice job finding the hidden boolean expression."
                : "Better luck next round."}
            </p>

            <button
              onClick={resetGame}
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

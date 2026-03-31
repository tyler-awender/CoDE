"use client";

import { useState, useEffect, useRef } from "react";

export function HigherLower() {
    const [started, setStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [hue, setHue] = useState(199);
    const tickRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            tickRef.current += 1;
            setHue(230 + 30 * Math.sin(tickRef.current * 0.02));
        }, 20);
        return () => clearInterval(interval);
    }, []);

    if (!started) {
    return (
        <div className="flex-1 grid place-items-center rounded-md border border-border bg-card text-muted-foreground overflow-auto w-full">
            <div
    className="flex flex-col items-center justify-center gap-6 rounded-xl border border-border p-10"
    style={{
        background: `linear-gradient(135deg, hsl(162, 81%, 34%) 0%, hsl(224, 86%, 32%) 100%)`,
        boxShadow: `0 0 40px hsl(0, 0%, 0%)`
    }}
>
            <div className="flex flex-col items-center gap-3 text-center">
                <h3
                    className="text-4xl font-bold bg-clip-text text-transparent"
                    style={{
                        backgroundImage: `linear-gradient(to right, hsl(${hue}, 60%, 20%), hsl(${(hue + 40) % 360}, 80%, 40%))`
                    }}
                >
                    Higher or Lower?
                </h3>
                <p className="text-card-foreground max-w-sm font-medium text-l">
                Two GitHub repositories will be shown. Pick the one with more stars.
                
                </p>
            </div>
            <button
                onClick={() => { setScore(0); setStarted(true); }}
                className="px-8 py-3 rounded-md bg-gradient-to-r from-[hsl(199,60%,50%)] to-[hsl(166,80%,38%)] text-white font-semibold text-lg hover:opacity-90 transition-opacity"
            >
                Start Game
            </button>
            </div>
        </div>
    )
  }
  return (
    <div className="flex-1 grid place-items-center rounded-md border border-border bg-card text-muted-foreground overflow-auto w-full">
      {!gameOver ? (
        <div className="flex flex-col h-full gap-4 w-[40vw] py-[2vh]">
          <div className="flex flex-col items-center justify-between px-2">
            <span className="text-2xl text-muted-foreground">Score</span>
            <span className="text-2xl font-bold text-foreground text-center">{score}</span>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
              vs
            </span>
          </div>
          <div className="flex flex-1 gap-4">
            {["A", "B"].map((label) => (
              <button
                key={label}
                onClick={() => {setScore((s) => s + 1);}} /* Replace with star count check */
                className="group flex-1 flex flex-col items-center justify-center gap-4  rounded-md border border-border bg-background hover:border-[hsl(199,60%,50%)] hover:bg-accent transition-all duration-200 p-6 text-left"
              >
                <div className="w-full flex flex-col gap-2 items-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground group-hover:bg-[hsl(199,60%,50%)]/20 transition-colors">
                    {label}
                  </div>
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                </div>
                <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                  Pick this
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
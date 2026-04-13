"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, GripVertical, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { algorithms, languages, type Language } from "@/lib/algorithms";

interface CodeLine {
  id: number;
  text: string;
  originalIndex: number;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ScrambledAlgorithms() {
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(algorithms[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");
  const [lines, setLines] = useState<CodeLine[]>([]);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const selectedAlgorithm = useMemo(
    () => algorithms.find((algorithm) => algorithm.id === selectedAlgorithmId) ?? algorithms[0],
    [selectedAlgorithmId],
  );

  const correctLines = selectedAlgorithm.implementations[selectedLanguage];

  const resetPuzzle = useCallback(() => {
    const initial = correctLines.map((text, index) => ({ id: index, text, originalIndex: index }));
    let mixed = shuffle(initial);

    while (mixed.every((line, index) => line.originalIndex === index)) {
      mixed = shuffle(initial);
    }

    setLines(mixed);
    setMoves(0);
    setIsSolved(false);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [correctLines]);

  useEffect(() => {
    resetPuzzle();
  }, [resetPuzzle]);

  useEffect(() => {
    if (lines.length === 0) {
      return;
    }

    const solved = lines.every((line, index) => line.originalIndex === index);
    if (solved) {
      setIsSolved(true);
    }
  }, [lines]);

  const handleDrop = (dropIndex: number) => {
    if (isSolved || draggedIndex === null || dropIndex === draggedIndex) {
      setDragOverIndex(null);
      return;
    }

    setLines((currentLines) => {
      const reordered = [...currentLines];
      const [draggedLine] = reordered.splice(draggedIndex, 1);
      reordered.splice(dropIndex, 0, draggedLine);
      return reordered;
    });

    setMoves((currentMoves) => currentMoves + 1);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Card className="w-full border-border/40 bg-card/80">
      <CardHeader>
        <CardTitle className="text-2xl">Scrambled Algorithms</CardTitle>
        <CardDescription>
          Reorder the code lines into a valid implementation using drag and drop.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground">
            Algorithm
            <select
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={selectedAlgorithmId}
              onChange={(event) => setSelectedAlgorithmId(event.target.value)}
            >
              {algorithms.map((algorithm) => (
                <option key={algorithm.id} value={algorithm.id}>
                  {algorithm.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-foreground">
            Language
            <select
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value as Language)}
            >
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-sm text-muted-foreground">{selectedAlgorithm.description}</p>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Moves: {moves}</p>
          <Button variant="outline" size="sm" onClick={resetPuzzle}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {isSolved ? (
          <div className="flex items-center gap-2 rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-700">
            <Check className="h-4 w-4" />
            Solved in {moves} moves.
          </div>
        ) : null}

        <div className="rounded-lg border border-border/60 bg-muted/30 p-2 sm:p-3">
          {lines.map((line, index) => (
            <div
              key={`${line.id}-${line.originalIndex}`}
              draggable={!isSolved}
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(event) => {
                event.preventDefault();
                if (!isSolved) {
                  setDragOverIndex(index);
                }
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(event) => {
                event.preventDefault();
                handleDrop(index);
              }}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              className={`mb-1 flex items-start gap-2 rounded-md px-2 py-2 text-sm font-mono transition-colors last:mb-0 ${
                isSolved
                  ? "bg-green-500/5"
                  : dragOverIndex === index
                    ? "bg-primary/15"
                    : "bg-background hover:bg-muted"
              } ${isSolved ? "cursor-default" : "cursor-grab"}`}
            >
              <GripVertical className="mt-[2px] h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="w-6 shrink-0 text-right text-muted-foreground">{index + 1}</span>
              <pre className="m-0 whitespace-pre-wrap break-all text-foreground">{line.text}</pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

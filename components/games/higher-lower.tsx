"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function HigherLower() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const invalid = {
    id: -1,
    name: 'N/A',
    star_count: -1,
    description: 'N/A',
    avatar_url: 'N/A'
  }
  const [option1, setOption1] = useState(invalid);
  const [option2, setOption2] = useState(invalid);

  const select_two = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('select_two_repos');

    if (error) {
      console.error('Error fetching random rows:', error);
    } else {
      setOption1(data[0]);
      setOption2(data[1]);
    }
  };

  const select_one = async (option1: number, option2: number) => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('select_new_repo', {option1: option1, option2: option2});

    if (error) {
      console.error('Error fetching random row:', error);
      return invalid;
    } else {
      return data;
    }
  };
  
  const check_correct = async (selected: number) => {
    const button1 = document.getElementById(option1.id+'') as HTMLButtonElement;
    const button2 = document.getElementById(option2.id+'') as HTMLButtonElement;
    const stars1 = document.getElementById(option1.id+'_stars') as HTMLDivElement;
    const stars2 = document.getElementById(option2.id+'_stars') as HTMLDivElement;

    button1.disabled = true;
    button2.disabled = true;

    if ((option1.id == selected) && (option1.star_count >= option2.star_count) || (option2.id == selected) && (option1.star_count <= option2.star_count)) {
      stars1.innerText = "⭐ " + option1.star_count.toLocaleString() + " stars";
      stars2.innerText = "⭐ " + option2.star_count.toLocaleString() + " stars";
      setScore(score + 1);

      const newOption = await select_one(option1.id, option2.id);
      setOption1(option2);
      setOption2(newOption);
      
      button1.disabled = false;
      button2.disabled = false;
    } else {
      setGameOver(true);
    }
  }

  const startGame = async () => {
    (document.getElementById("startButton") as HTMLButtonElement).disabled = true;
    await select_two();
    setScore(0);
    setStarted(true);
  }

    if (!started) {
    return (
        <div className="flex-1 grid place-items-center rounded-md border border-border bg-card text-muted-foreground overflow-auto w-full">
            <div
    className="flex flex-col items-center justify-center gap-6 rounded-xl border border-border p-10"
    style={{
        background: `linear-gradient(135deg, hsl(162, 81%, 34%) 0%, hsl(224, 86%, 32%) 100%)`,
        boxShadow: `0 0 80px hsl(249, 87%, 27%)`
    }}
>
            <div className="flex flex-col items-center gap-3 text-center">
                <h3
                    className="text-4xl font-bold bg-clip-text text-transparent"
                    style={{
                        backgroundImage: `linear-gradient(to right, hsl(180, 66%, 47%), hsl(209, 66%, 57%))`
                    }}
                >
                    Higher or Lower?
                </h3>
                <p className="text-card-foreground max-w-sm font-medium text-l">
                Two GitHub repositories will be shown. Pick the one with more stars.
                
                </p>
            </div>
            <button
                id="startButton"
                onClick={ startGame }
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
            {[option1, option2].map((option) => (
              <button
                id={""+option.id}
                key={option.id}
                onClick={() => { check_correct(option.id); }}
                className="group options flex-1 flex flex-col items-center justify-center gap-4  rounded-md border border-border bg-background hover:border-[hsl(199,60%,50%)] hover:bg-accent transition-all duration-200 p-6 text-left"
              >
                <div className="w-full flex flex-col gap-2 items-center pb-20">
                  <img src={option.avatar_url} className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground group-hover:bg-[hsl(199,60%,50%)]/20 transition-colors"></img>
                  
                  <div className="rounded bg-muted text-center px-2">{option.name}</div>
                  <div className="rounded bg-popover text-center px-1"> {option.description} </div>
                  <div id = {option.id + '_stars'} className="rounded bg-card"> </div>
                </div>
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
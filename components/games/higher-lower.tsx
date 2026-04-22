"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import styles from './higher-lower.module.css';
import { createGameEntry } from '@/lib/create-game-entry';

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

  const [flashId, setFlashId] = useState<number | null>(null);
  const [scorePop, setScorePop] = useState(false);
  const [alternate, setAlternate] = useState(0);

  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!gameOver) return;
    setDisplayScore(0);
    let current = 0;

    const tick = () => {
      current += 1;
      if (current <= score) {
        setDisplayScore(current);
        const delay = Math.ceil(250 / (0.2 * current + 1));
        setTimeout(tick, delay);
      }
    };

    setTimeout(tick, 800);
  }, [gameOver]);

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
    const correct_audio = document.getElementById("correct_sound") as HTMLAudioElement;
    const incorrect_audio = document.getElementById("incorrect_sound") as HTMLAudioElement;

    button1.disabled = true;
    button2.disabled = true;
    stars1.innerText = "⭐ " + option1.star_count.toLocaleString() + " stars";
    stars2.innerText = "⭐ " + option2.star_count.toLocaleString() + " stars";

    if ((option1.id == selected) && (option1.star_count >= option2.star_count) || (option2.id == selected) && (option1.star_count <= option2.star_count)) {
      correct_audio.play();
      setScore(score + 1);
      setScorePop(true);
      setTimeout(() => setScorePop(false), 400);
      if (option1.id == selected) {
        setFlashId(selected);
        await new Promise(r => setTimeout(r, 750));
        setFlashId(null);
      }
      if (option2.id == selected) {
        setFlashId(selected);
        await new Promise(r => setTimeout(r, 750));
        setFlashId(null);
      }

      const newOption = await select_one(option1.id, option2.id);
      setAlternate((alternate + 1) % 3);
      setOption1(option2);
      setOption2(newOption);
      
      button1.disabled = false;
      button2.disabled = false;
    } else {
      setGameOver(true);
      await new Promise(r => setTimeout(r, 175));
      incorrect_audio.play();
      await createGameEntry('higher-lower', score);
    }
  }

  const startGame = async () => {
    (document.getElementById("startButton") as HTMLButtonElement).disabled = true;
    await select_two();
    setScore(0);
    setStarted(true);
  }

  const restartGame = async () => {
    (document.getElementById("restartButton") as HTMLButtonElement).disabled = true;
    await select_two();
    (document.getElementById(option1.id+'') as HTMLButtonElement).disabled = false;
    (document.getElementById(option2.id+'') as HTMLButtonElement).disabled = false;
    (document.getElementById(option1.id+'_stars') as HTMLDivElement).innerText = "";
    (document.getElementById(option2.id+'_stars') as HTMLDivElement).innerText = "";
    setScore(0);
    setGameOver(false);
    (document.getElementById("restartButton") as HTMLButtonElement).disabled = false;
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
            Two GitHub repositories will be shown. Pick the one you think has more stars.
            
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
    <div className="flex-1 grid place-items-center rounded-md border border-border bg-card text-muted-foreground overflow-auto w-full relative">
      <audio id="correct_sound" src="/sfx/correct_option.mp3"></audio>
      <audio id="incorrect_sound" src="/sfx/wrong_option.mp3"></audio>
      {gameOver && (
        <div className={`${styles.gameover_backdrop} absolute inset-0 z-40 bg-black/50 flex items-center justify-center`}>
          <div
            className={`${styles.gameover_panel} flex flex-col items-center justify-center gap-6 rounded-xl border border-border p-10`}
            style={{
              background: `linear-gradient(135deg, hsl(162,81%,34%) 0%, hsl(224,86%,32%) 100%)`,
              boxShadow: `0 0 80px hsl(249,87%,27%)`
            }}
          >
          <div className="flex flex-col items-center gap-4 text-center">
            <h3
              className={`${styles.gameover_title} text-4xl font-bold bg-clip-text text-transparent`}
              style={{ backgroundImage: `linear-gradient(to right, hsl(0,89%,48%), hsl(4,76%,44%))` }}
            >
              Game Over
            </h3>
            <div className={`${styles.gameover_score} flex flex-col items-center gap-1`}>
              <span className="text-s font-semibold tracking-widest uppercase text-white/50">
                Final Score
              </span>
              <span className="text-6xl font-bold text-white">
                {displayScore}
              </span>
            </div>
            <div className="w-16 border-t border-white/20" />
            <p className={`${styles.gameover_message} text-sm text-white/50`}>
              Play Again?
            </p>
          </div>
            <button
              id="restartButton"
              onClick={restartGame}
              className={`${styles.gameover_backdrop} px-8 py-3 rounded-md bg-gradient-to-r from-[hsl(199,60%,50%)] to-[hsl(166,80%,38%)] text-white font-semibold text-lg hover:opacity-90 transition-opacity`}
            >
              Start Over
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col h-full gap-4 w-[40vw] py-[2vh]">
        <div className="flex flex-col items-center justify-between px-2">
          <span className="text-2xl text-muted-foreground">Score</span>
          <span className={`text-2xl font-bold text-foreground text-center ${scorePop ? styles.score_pop : ""}`}>
            {score}
          </span>
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
          {[option1, option2].map((option, index) => (
            <button
              id={""+option.id}
              key={option.id}
              onClick={() => { check_correct(option.id); }}
              style={{
                  background: (alternate == 0)
                    ? ( (index == 0) ? 'linear-gradient(135deg, hsl(224, 86%, 10%) 0%, hsl(162, 81%, 8%) 100%)' : 'linear-gradient(320deg, hsl(350, 80%, 8%) 0%, hsl(24, 78%, 21%) 100%)')
                    : ((alternate == 1)
                      ? ( (index == 0) ? 'linear-gradient(320deg, hsl(350, 80%, 8%) 0%, hsl(24, 78%, 21%) 100%)' : 'linear-gradient(220deg, hsl(240, 60%, 10%) 0%, hsl(279, 91%, 18%) 100%)')
                      : ( (index == 0) ? 'linear-gradient(220deg, hsl(240, 60%, 10%) 0%, hsl(279, 91%, 18%) 100%)' : 'linear-gradient(135deg, hsl(224, 86%, 10%) 0%, hsl(162, 81%, 8%) 100%)'))
                }}
              className={`group options flex-1 flex flex-col items-center justify-center gap-4 rounded-md border border-border
                hover:border-[hsl(199,60%,50%)] transition-all duration-200 p-6 text-left relative overflow-hidden 
                ${flashId === option.id ? 'ring-2 ring-green-400 scale-[1.02]' : ''}`}
            >
              {flashId === option.id && (
              <div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit', 
                pointerEvents: 'none', zIndex: 10}} className={styles.shimmer_bar}
              />
              )}
              <div className="w-full flex flex-col gap-3 items-center pb-40">
                <img
                  src={option.avatar_url}
                  className="w-32 h-32 rounded-full ring-2 ring-white/10"
                />
                <div className="text-lg font-mono text-white/90 bg-white/10 rounded-md px-3 py-1">
                  {option.name}
                </div>
                <p className="text-base text-white/60 text-center leading-snug max-w-[260px]">
                  {option.description}
                </p>
                <div
                  id={option.id + '_stars'}
                  className="text-sm font-semibold text-yellow-400"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
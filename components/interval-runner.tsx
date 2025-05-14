"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function IntervalRunner() {
  const [walkMinutes, setWalkMinutes] = useState(0);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [runMinutes, setRunMinutes] = useState(0);
  const [runSeconds, setRunSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWalkingPhase, setIsWalkingPhase] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [playSound, setPlaySound] = useState(false);
  const [vibrate, setVibrate] = useState(false);

  const audioRefWalk = useRef<HTMLAudioElement>(null);
  const audioRefRun = useRef<HTMLAudioElement>(null);

  const triggerActions = (isWalk: boolean) => {
    if (playSound) {
      if (isWalk) audioRefWalk.current?.play();
      else audioRefRun.current?.play();
    }
    if (vibrate && navigator.vibrate) {
      navigator.vibrate(isWalk ? [200] : [300, 100, 300]);
    }
  };

  const startTimer = () => {
    const initial = (walkMinutes * 60 + walkSeconds) || 1;
    setRemainingTime(initial);
    setIsRunning(true);
    setIsWalkingPhase(true);
    triggerActions(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setRemainingTime(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && remainingTime === 0) {
      const nextDuration = isWalkingPhase
        ? runMinutes * 60 + runSeconds
        : walkMinutes * 60 + walkSeconds;
      const nextPhaseIsWalk = !isWalkingPhase;
      setIsWalkingPhase(nextPhaseIsWalk);
      setRemainingTime(nextDuration || 1);
      triggerActions(nextPhaseIsWalk);
    }
    return () => interval && clearInterval(interval);
  }, [isRunning, remainingTime, isWalkingPhase, playSound, vibrate, walkMinutes, walkSeconds, runMinutes, runSeconds]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-md mx-auto py-10 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Corrida Intercalada</h1>

      <div className="text-lg font-semibold text-gray-500 uppercase">
        {isWalkingPhase ? "Caminhada" : "Corrida"}
      </div>

      <div className="text-6xl font-mono font-bold">
        {formatTime(remainingTime)}
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col">
          <Label className="mb-1">Caminhada</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <Input type="number" placeholder="min" value={walkMinutes} onChange={(e) => setWalkMinutes(Number(e.target.value))} />
              <span className="text-xs text-center text-muted-foreground">min</span>
            </div>
            <div className="flex flex-col">
              <Input type="number" placeholder="seg" value={walkSeconds} onChange={(e) => setWalkSeconds(Number(e.target.value))} />
              <span className="text-xs text-center text-muted-foreground">seg</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <Label className="mb-1">Corrida</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <Input type="number" placeholder="min" value={runMinutes} onChange={(e) => setRunMinutes(Number(e.target.value))} />
              <span className="text-xs text-center text-muted-foreground">min</span>
            </div>
            <div className="flex flex-col">
              <Input type="number" placeholder="seg" value={runSeconds} onChange={(e) => setRunSeconds(Number(e.target.value))} />
              <span className="text-xs text-center text-muted-foreground">seg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-2">
        <div className="flex items-center gap-2">
          <Label>Som</Label>
          <Switch checked={playSound} onCheckedChange={setPlaySound} />
        </div>
        <div className="flex items-center gap-2">
          <Label>Vibrar</Label>
          <Switch checked={vibrate} onCheckedChange={setVibrate} />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={startTimer}>Iniciar</Button>
        <Button variant="destructive" onClick={stopTimer}>Parar</Button>
      </div>

      <audio ref={audioRefWalk} src="/sounds/caminha.wav" preload="auto" />
      <audio ref={audioRefRun} src="/sounds/corre.wav" preload="auto" />
    </div>
  );
}
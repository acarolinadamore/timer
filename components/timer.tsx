"use client"

import { useEffect, useState, useRef } from "react"
import { Play, Pause, Repeat, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SoundSelector } from "@/components/sound-selector"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

export function Timer() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [repeatSound, setRepeatSound] = useState(false)
  const [selectedSound, setSelectedSound] = useState("/sounds/ding-dong.wav")
  const [availableSounds, setAvailableSounds] = useState<string[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Carrega lista de sons ao iniciar
  useEffect(() => {
    fetch("/api/sounds")
      .then((res) => res.json())
      .then((data) => {
        setAvailableSounds(data)
        if (!data.includes(selectedSound)) {
          setSelectedSound(data[0])
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar sons:", err)
        toast({ title: "Erro", description: "Falha ao carregar lista de sons", variant: "destructive" })
      })
  }, [])

  useEffect(() => {
    const total = hours * 3600 + minutes * 60 + seconds
    setTotalSeconds(total)
  }, [hours, minutes, seconds])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!)
            setIsRunning(false)
            setIsFinished(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (totalSeconds === 0 && !isFinished) {
      setIsRunning(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, totalSeconds, isFinished])

  useEffect(() => {
    if (isFinished && audioRef.current) {
      const playSound = () => {
        audioRef.current!.currentTime = 0
        audioRef.current!.play().catch((error) => {
          console.error("Error playing sound:", error)
          toast({
            title: "Sound Error",
            description: "Could not play the selected sound.",
            variant: "destructive",
          })
        })
      }

      audioRef.current!.loop = repeatSound
      playSound()

      if (isMobile && "vibrate" in navigator) {
        navigator.vibrate([300, 100, 300, 100, 300])
      }
    }
  }, [isFinished, repeatSound, isMobile, toast])

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (totalSeconds > 0) {
      setIsRunning(true)
      setIsFinished(false)
    } else {
      toast({
        title: "No time set",
        description: "Please set a time before starting the timer.",
      })
    }
  }

  const handlePause = () => setIsRunning(false)

  const handleStop = () => {
    setIsRunning(false)
    setIsFinished(false)
    setTotalSeconds(hours * 3600 + minutes * 60 + seconds)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.loop = false
    }
  }

  const handleSoundChange = (sound: string) => setSelectedSound(sound)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const text = await res.text()
      if (!res.ok) throw new Error(text)
      const data = JSON.parse(text)

      setAvailableSounds((prev) => [...new Set([...prev, data.filename])])
      setSelectedSound(data.filename)

      toast({
        title: "Upload concluído",
        description: `Som "${file.name}" adicionado com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao enviar", error)
      toast({
        title: "Erro no upload",
        description: "Não foi possível adicionar o som.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      <div
        className={cn(
          "text-7xl md:text-9xl font-mono font-bold text-center transition-all",
          isFinished ? "text-red-500 animate-pulse" : "text-slate-800 dark:text-slate-100"
        )}
      >
        {formatTime(totalSeconds)}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full">
        <div>
          <Label htmlFor="hours">Horas</Label>
          <Input id="hours" type="number" min="0" max="23" value={hours} onChange={(e) => setHours(Number(e.target.value) || 0)} disabled={isRunning} className="text-center" />
        </div>
        <div>
          <Label htmlFor="minutes">Minutos</Label>
          <Input id="minutes" type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 0)} disabled={isRunning} className="text-center" />
        </div>
        <div>
          <Label htmlFor="seconds">Segundos</Label>
          <Input id="seconds" type="number" min="0" max="59" value={seconds} onChange={(e) => setSeconds(Number(e.target.value) || 0)} disabled={isRunning} className="text-center" />
        </div>
      </div>

      <SoundSelector onSoundChange={handleSoundChange} selectedSound={selectedSound} options={availableSounds} />

      <div className="w-full">
        <Label className="text-sm font-medium mt-2 mb-1 block">+ Adicionar som</Label>
        <Input type="file" accept=".mp3,.wav,.mp4" onChange={handleFileUpload} disabled={isRunning} />
      </div>

      <div className="flex gap-4 flex-wrap justify-center w-full">
        {!isRunning ? (
          <Button onClick={handleStart} size="lg" className="w-24" variant="purple">
            <Play className="mr-2 h-4 w-4" /> Play
          </Button>
        ) : (
          <Button onClick={handlePause} size="lg" variant="outline" className="w-24">
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
        )}

<Button
  onClick={handleStop}
  size="lg"
  variant="destructive"
  className="w-24"
>
  <Square className="mr-2 h-4 w-4" /> Stop
</Button>

<Button
  onClick={() => setRepeatSound(!repeatSound)}
  size="lg"
  variant={repeatSound ? "purple" : "outline"}
  className="w-24"
>
  <Repeat className="mr-2 h-4 w-4" /> {repeatSound ? "Repeating" : "Repeat"}
</Button>

      </div>

      <audio ref={audioRef} src={selectedSound} />
    </div>
  )
}

"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface Props {
  selectedSound: string
  options: string[]
  onSoundChange: (sound: string) => void
}

export function SoundSelector({ selectedSound, options, onSoundChange }: Props) {
  return (
    <div className="w-full">
      <Label htmlFor="sound-select" className="mb-1 block text-sm font-medium">
        Escolha o som do alarme:
      </Label>
      <Select value={selectedSound} onValueChange={onSoundChange}>
        <SelectTrigger id="sound-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((sound) => (
            <SelectItem key={sound} value={sound}>
              {sound.replace("/sounds/", "").replace(/\.[^/.]+$/, "")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

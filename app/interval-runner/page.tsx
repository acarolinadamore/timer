// app/page.tsx
"use client"

import IntervalRunner from "@/components/interval-runner"

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <IntervalRunner />
    </main>
  )
}
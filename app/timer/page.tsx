import { Timer } from "@/components/timer";

export default function TimerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <h1 className="text-5xl font-bold mb-8 text-slate-800 dark:text-slate-100">Timer</h1>
      <Timer />
    </main>
  );
}

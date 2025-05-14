"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full max-w-md mx-auto py-10 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center">Selecione uma opção</h1>

      <Link href="/timer">
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <p className="text-xl font-semibold">Timer</p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/interval-runner">
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <p className="text-xl font-semibold">Corrida Intercalada</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

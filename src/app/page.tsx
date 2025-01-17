"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const board = [
    ...Array(5).fill(Array(15).fill("")), // Top empty rows
    ["", "", "", "", "", "", "X", "O", "X", "O", "", "", "", "", ""],
    ["", "", "", "", "", "O", "X", "O", "X", "O", "", "", "", "", ""],
    ["", "", "", "", "", "", "O", "X", "O", "X", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "X", "O", "X", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "X", "O", "", "", "", "", ""],
    ...Array(5).fill(Array(15).fill("")), // Bottom empty rows
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-16">
      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 flex flex-row gap-8 items-center justify-between w-full h-[90vh]">
        {/* Call to Action */}
        <div className="space-y-6 w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Think Different Academy
          </h1>
          <p className="text-muted-foreground">
            Challenge yourself by playing Tic Tac Toe Online.
          </p>

          <div className="space-y-4 flex flex-col">
            <Link href="/game" className="w-1/2">
              <Button className="w-full h-12 text-lg" size="lg">
                Local Multiplayer
              </Button>
            </Link>

            <Link href="/games" className="w-1/2">
              <Button
                variant="secondary"
                className="w-full h-12 text-lg"
                size="lg"
              >
                Puzzles
              </Button>
            </Link>
          </div>
        </div>

        {/* Game Board */}
        <div className="flex justify-end items-center w-full">
          <div className="flex flex-wrap rounded-lg border border-gray-400 max-w-sm md:max-w-md 2xl:max-w-lg aspect-square w-full">
            {board.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className="border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                  style={{
                    flexBasis: `${100 / 15}%`,
                    height: `calc(100% / 15)`,
                  }}
                >
                  {cell === "X" && (
                    <img src="/X_modre.svg" alt="X" className="w-3/4 h-3/4" />
                  )}
                  {cell === "O" && (
                    <img src="/O_cervene.svg" alt="O" className="w-3/4 h-3/4" />
                  )}
                </div>
              )),
            )}
          </div>
        </div>
      </main>

      {/* Sections */}
      <section className="container mx-auto p-4 md:p-6 flex flex-row-reverse gap-8 items-center justify-between w-full h-[75vh]">
        <div className="flex-1 flex flex-col gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Local Multiplayer
          </h2>
          <p className="text-muted-foreground">Play local with your friends!</p>
          <div className="flex justify-center">
            <Link href="/game" className="w-1/2">
              <Button className="w-full h-12 text-lg" size="lg">
                Play
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/O_cervene.svg" alt="Local Multiplayer" className="h-40" />
        </div>
      </section>

      <section className="container mx-auto p-4 md:p-6 flex flex-row gap-8 items-center justify-between w-full h-[75vh]">
        <div className="flex-1 flex flex-col gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Puzzles</h2>
          <p className="text-muted-foreground">Try to resolve our puzzles!</p>
          <div className="flex justify-center">
            <Link href="/games" className="w-1/2">
              <Button className="w-full h-12 text-lg" size="lg">
                Play
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img src="/O_cervene.svg" alt="Puzzles" className="h-40" />
        </div>
      </section>
    </div>
  );
}

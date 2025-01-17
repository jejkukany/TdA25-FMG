"use client";

import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row-reverse md:grid md:grid-cols-2 gap-8 items-center">
          {/* Call to Action */}
          <div className="space-y-6 w-full">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Play Tic Tac Toe Online
              </h1>
              <p className="text-muted-foreground">
                Challenge yourself or play with friends.
              </p>
            </div>

            <div className="space-y-4">
              <Button className="w-full h-12 text-lg" size="lg">
                Local Multiplayer
              </Button>
              <Button
                variant="secondary"
                className="w-full h-12 text-lg"
                size="lg"
              >
                Puzzles
              </Button>
            </div>
          </div>

          {/* Game Board */}
          <div className="flex justify-center items-center w-full">
            <div className="flex flex-wrap rounded-lg border border-gray-400 w-full max-w-sm md:max-w-md aspect-square">
              {board.map((row, rowIndex) =>
                row.map((cell: string, cellIndex: number) => (
                  <div
                    key={`${rowIndex}-${cellIndex}`}
                    className={`border border-gray-300 dark:border-gray-600 flex items-center justify-center`}
                    style={{
                      flexBasis: `${100 / 15}%`,
                      height: `calc(100% / 15)`,
                    }}
                  >
                    {cell === "X" && (
                      <img src="/X_modre.svg" alt="X" className="w-3/4 h-3/4" />
                    )}
                    {cell === "O" && (
                      <img
                        src="/O_cervene.svg"
                        alt="O"
                        className="w-3/4 h-3/4"
                      />
                    )}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

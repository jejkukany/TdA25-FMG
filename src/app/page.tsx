"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import ThemeImage from "@/components/custom/ThemeImage";

export default function Home() {
  const initialBoard = [
    ...Array(5).fill(Array(15).fill("")),
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ...Array(5).fill(Array(15).fill("")),
  ];

  const [board, setBoard] = useState(initialBoard);
  const [moveIndex, setMoveIndex] = useState(0);

  const predefinedMoves = [
    { row: 7, col: 7, player: "X" },
    { row: 7, col: 8, player: "O" },
    { row: 6, col: 7, player: "X" },
    { row: 6, col: 8, player: "O" },
    { row: 8, col: 7, player: "X" },
    { row: 8, col: 8, player: "O" },
    { row: 5, col: 7, player: "X" },
    { row: 9, col: 8, player: "O" },
    { row: 9, col: 7, player: "X" },
    { row: 6, col: 6, player: "O" },
    { row: 6, col: 9, player: "X" },
    { row: 7, col: 6, player: "O" },
    { row: 7, col: 9, player: "X" },
  ];

  const makeMove = () => {
    if (moveIndex >= predefinedMoves.length) return;

    const { row, col, player } = predefinedMoves[moveIndex];
    const newBoard = [...board];
    newBoard[row][col] = player;
    setBoard(newBoard);

    setMoveIndex(moveIndex + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      makeMove();
    }, 500);

    return () => clearInterval(interval);
  }, [moveIndex]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-16">
      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 flex flex-col-reverse md:flex-row gap-8 items-center md:justify-between w-full md:h-[90vh] text-center md:text-left">
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 w-full"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            Think Different Academy
          </h1>
          <p className="text-muted-foreground">
            Challenge yourself by playing Tic Tac Toe Online. Improve your
            strategy and take on various puzzles!
          </p>

          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link href="/game" className="w-1/2">
              <Button
                className="w-full h-12 font-medium px-2 sm:px-4"
                size="lg"
              >
                Local Multiplayer
              </Button>
            </Link>

            <Link href="/games" className="w-1/2">
              <Button
                variant="secondary"
                className="w-full h-12 font-medium px-2 sm:px-4"
                size="lg"
              >
                Puzzles
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            type: "spring",
            stiffness: 150,
            damping: 12,
          }}
          className="flex justify-end items-center w-full"
        >
          <div className="flex flex-wrap rounded-lg border border-gray-400 max-w-sm md:max-w-md 2xl:max-w-lg aspect-square w-full">
            <AnimatePresence>
              {board.map((row, rowIndex) =>
                row.map((cell: string, cellIndex: number) => (
                  <motion.div
                    key={`${rowIndex}-${cellIndex}`}
                    className="border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                    style={{
                      flexBasis: `${100 / 15}%`,
                      height: `calc(100% / 15)`,
                    }}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    {cell === "X" && (
                      <motion.img
                        src="/TDA/X_modre.svg"
                        alt="X"
                        className="w-3/4 h-3/4"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    {cell === "O" && (
                      <motion.img
                        src="/TDA/O_cervene.svg"
                        alt="O"
                        className="w-3/4 h-3/4"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.div>
                )),
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Section 1 */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: [0.17, 0.67, 0.83, 0.67],
        }}
        className="container mx-auto p-4 md:p-6 flex flex-col-reverse md:flex-row-reverse  gap-8 items-center justify-between w-full h-[75vh]"
      >
        <div className="flex-1 flex flex-col gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-1">
            Local Multiplayer
          </h2>
          <p className="text-muted-foreground">
            Challenge your friends to a thrilling game of Tic Tac Toe! Show your
            strategic moves and outsmart your opponent!
          </p>
          <div className="flex justify-center">
            <Link href="/game" className="w-1/2">
              <Button className="w-full h-12 text-lg" size="lg">
                Play
              </Button>
            </Link>
          </div>
        </div>
        <motion.div
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="flex-1 flex justify-center"
        >
          <Image
            src="/Fighting_HomePage.svg"
            alt="Local Multiplayer"
            width={1000}
            height={1000}
          />
        </motion.div>
      </motion.section>

      {/* Section 2 */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: [0.17, 0.67, 0.83, 0.67],
        }}
        className="container mx-auto p-4 md:p-6 flex flex-col-reverse md:flex-row gap-8 items-center justify-between w-full h-[75vh]"
      >
        <div className="flex-1 flex flex-col gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-1">Puzzles</h2>
          <p className="text-muted-foreground">
            Get ready for a variety of challenging puzzles! Test your
            problem-solving skills and see how quickly you can solve them.
          </p>
          <div className="flex justify-center">
            <Link href="/games" className="w-1/2">
              <Button className="w-full h-12 text-lg" size="lg">
                Play
              </Button>
            </Link>
          </div>
        </div>
        <ThemeImage />
      </motion.section>
    </div>
  );
}

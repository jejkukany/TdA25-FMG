"use client"
import { useState, useMemo } from "react"
import GameList from "@/components/custom/games/GameList"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGames } from "@/queries/useGames"
import type { DifficultyType, GameState } from "@/types/gameTypes"
import Image from "next/image"
import Loading from "../loading"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

const difficultyOptions: DifficultyType[] = ["beginner", "easy", "medium", "hard", "extreme"]
const gameStateOptions: GameState[] = ["opening", "midgame", "endgame", "unknown"]

const Games = () => {
  const { data: games, isPending, isError, error } = useGames()
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyType | "all">("all")
  const [gameStateFilter, setGameStateFilter] = useState<GameState | "all">("all")

  const filteredGames = useMemo(() => {
    if (!games) return []
    return games.filter((game) => {
      const nameMatch = game.name.toLowerCase().includes(searchTerm.toLowerCase())
      const difficultyMatch = difficultyFilter === "all" || game.difficulty === difficultyFilter
      const gameStateMatch = gameStateFilter === "all" || game.gameState === gameStateFilter
      return nameMatch && difficultyMatch && gameStateMatch
    })
  }, [games, searchTerm, difficultyFilter, gameStateFilter])

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error.message}</div>
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold text-center sm:text-left">Games</h1>
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-1/3"
          />
          <div className="flex flex-wrap gap-4 flex-grow items-center justify-between">
            <div className="flex flex-wrap gap-4 flex-grow">
              <Select
                value={difficultyFilter}
                onValueChange={(value) => setDifficultyFilter(value as DifficultyType | "all")}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficultyOptions.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      <div className="flex flex-row gap-2 ">
                        <Image
                          src={`/TDA/zarivka_${difficulty}_modre.svg`}
                          alt={`${difficulty} difficulty`}
                          width={24}
                          height={24}
                        />
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={gameStateFilter} onValueChange={(value) => setGameStateFilter(value as GameState | "all")}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Game State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {gameStateOptions.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state.charAt(0).toUpperCase() + state.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Link href={"/game/create"}>
              <Button className="whitespace-nowrap">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Game
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {filteredGames.length === 0 ? (
        <p className="text-center text-gray-500">No games found.</p>
      ) : (
        <GameList games={filteredGames} />
      )}
    </div>
  )
}

export default Games

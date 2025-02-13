import Board from "@/components/custom/game/Board/Board";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play, Create and Learn | Tic-Tac-Toe",
  description: "Unleash your beast and compete in a 1v1 old-style! Make your moves, and experiment however you like. Want to play again? Save your progress and return to where you left off, or undo the last move and rethink your strategy. The possibilities are endless!",
  openGraph: {
    title: "Play, Create and Learn | Tic-Tac-Toe",
    description: "Unleash your beast and compete in a 1v1 old-style! Make your moves, and experiment however you like. Want to play again? Save your progress and return to where you left off, or undo the last move and rethink your strategy. The possibilities are endless!",
    url: "https://13682ac4.app.deploy.tourde.app/game/",
    siteName: "Tic-Tac-Toe",
    type: "website",
  },
}

export default function GamesPage() {
  return (
    <div className="2xl:px-4 w-full flex flex-col lg:justify-center xl:mt-[-28px] lg:min-h-screen">
      <Board
        initialBoard={Array.from({ length: 15 }, () => Array(15).fill(""))}
      />
    </div>
  );
}

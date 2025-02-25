import Board from "@/components/custom/create/Board";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your Game | Tic-Tac-Toe",
  description: "Set up your perfect match! Choose your difficulty and start playing. Whether you are a beginner or a pro, the challenge awaits!",
  openGraph: {
    title: "Create your Game | Tic-Tac-Toe",
    description: "Set up your perfect match! Choose your difficulty and start playing. Whether you are a beginner or a pro, the challenge awaits!",
    url: "https://13682ac4.app.deploy.tourde.app/game/create",
    siteName: "Tic-Tac-Toe",
    type: "website",
  },
}

export default function GamesCreatePage() {
  return (
    <div className="2xl:px-4 w-full flex flex-col lg:justify-center xl:mt-[-28px] lg:min-h-screen">
      <Board
        initialBoard={Array.from({ length: 15 }, () => Array(15).fill(""))}
      />
    </div>
  );
}
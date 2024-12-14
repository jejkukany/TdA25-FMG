import Board from "@/components/custom/game/Board";
import { Game as GameType } from "@/types/gameTypes";

const SpecificGame = async ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const req = await fetch(
    "http://localhost:3000/api/v1/games/" + (await params).uuid,
  );
  const data = (await req.json()) as GameType;

  return (
    <div className="flex-1 p-8">
      <Board initialBoard={data.board} />
    </div>
  );
};

export default SpecificGame;

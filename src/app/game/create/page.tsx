import Board from "@/components/custom/create/Board";

export default function GamesCreatePage() {
  return (
    <div className="2xl:px-4 w-full flex flex-col lg:justify-center xl:mt-[-28px] lg:min-h-screen">
      <Board
        initialBoard={Array.from({ length: 15 }, () => Array(15).fill(""))}
      />
    </div>
  );
}
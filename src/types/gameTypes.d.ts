type DifficultyType = "beginner" | "easy" | "medium" | "hard" | "extreme";

type BoardState = string[][] | null;

type GameState = "opening" | "midgame" | "endgame" | "unknown";

export type Error = {
  code: number;
  message: string;
};

export type Game = {
  uuid: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  difficulty: DifficultyType;
  gameState: GameState;
  board: BoardState;
};

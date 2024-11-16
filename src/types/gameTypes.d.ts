type Field = string;

type GameBoard = Field[][];

export type Game = {
    uuid: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    difficulty: string;
    gameState?: string;
    board: GameBoard;
}

export type GamesResponse = {
    status: string;
    data: Game[];
}
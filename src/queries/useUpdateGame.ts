import { useMutation } from "@tanstack/react-query";
import { Game as GameType } from "@/types/gameTypes";

// Helper function to generate a 15x15 empty board
const generateDefaultBoard = (): string[][] => {
  return Array.from({ length: 15 }, () => Array(15).fill(""));
};

// Function to add a game with default board
export const updateGame = async (game: {
  name: string;
  difficulty: string;
  board?: string[][];
  uuid: string;
}) => {
  try {
    const response = await fetch("/api/v1/games/" + game.uuid, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...game,
        board: game.board || generateDefaultBoard(), // Use provided board or default
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating game:", error);
    throw error;
  }
};

// React Query hook for creating games
export const useUpdateGame = () =>
  useMutation<
    GameType,
    Error,
    { name: string; difficulty: string; board?: string[][]; uuid: string }
  >({
    mutationKey: ["createGame"],
    mutationFn: updateGame,
    onError: (error) => {
      console.error("Error during game creation:", error);
    },
    onSuccess: (data) => {
      console.log("Game created successfully:", data);
    },
  });

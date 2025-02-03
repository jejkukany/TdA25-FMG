import { useMutation } from "@tanstack/react-query";
import { Game as GameType } from "@/types/gameTypes";

// Helper function to generate a 15x15 empty board

// Function to add a game with default board
export const deleteGame = async (game: { uuid: string }) => {
  try {
    const response = await fetch("/api/v1/games/" + game.uuid, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Check if the response has content
    const data = response.status !== 204 ? await response.json() : null;
    return data;
  } catch (error) {
    console.error("Error deleting game:", error);
    throw error;
  }
};

// React Query hook for creating games
export const useDeleteGame = () =>
  useMutation<GameType, Error, { uuid: string }>({
    mutationKey: ["deleteGame"],
    mutationFn: deleteGame,
  });

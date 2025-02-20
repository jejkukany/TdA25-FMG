import { useQuery } from "@tanstack/react-query";
import { Game as GameType } from "@/types/gameTypes";

export const fetchGames = async (): Promise<GameType[]> => {
  try {
    const response = await fetch("/api/v1/games/");
    if (!response.ok) {
      throw new Error(`Error fetching games: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching games:", error);
    return []; // Return an empty array in case of error
  }
};

export const useGames = () => useQuery<GameType[], Error>({
  queryKey: ['games'],
  queryFn: fetchGames,
});
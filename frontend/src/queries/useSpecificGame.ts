import { useQuery } from "@tanstack/react-query";
import { Game as GameType } from "@/types/gameTypes";

export const fetchSpecificGame = async (uuid: string): Promise<GameType> => {
    const response = await fetch(`/api/v1/games/${uuid}`);
  
    if (!response.ok) {
      throw new Error("Failed to fetch the game");
    }
  
    return response.json();
  };
  
  export const useSpecificGame = (uuid: string) => useQuery<GameType, Error>({
    queryKey: ['game', uuid],
    queryFn: () => fetchSpecificGame(uuid),
    enabled: !!uuid
  })
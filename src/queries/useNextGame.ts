import { useQuery } from "@tanstack/react-query";
import { Game as GameType } from "@/types/gameTypes";

export async function fetchNextGame(uuid: string) {
    const response = await fetch(`/api/v1/games/${uuid}/nextgame`);
    
    if (!response.ok) {
        throw new Error("Failed to fetch the game");
      }

    return response.json();
};


export const useNextGame = (uuid: string) => useQuery<GameType, Error>({
    queryKey: ['nextGame', uuid],
    queryFn: () => fetchNextGame(uuid),
    enabled: !!uuid,
    staleTime: 60 * 1000, //Cache na 1 minutu,
    retry: 2,
})
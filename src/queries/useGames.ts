import { useQuery } from "@tanstack/react-query";

export const fetchGames = async () => {
    try {
      const response = await fetch("/api/v1/games/");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching games:", error);
    }    
};

export const useGames = () => useQuery({
  queryKey: ['games'],
  queryFn: fetchGames,
})
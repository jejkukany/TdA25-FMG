"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, LogIn, Search, Trophy, Target, Clock, X } from "lucide-react";
import { client } from "@/server/auth/client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface WaitingRoomProps {
  onStartGame: (player1: string, player2: string, player1Elo?: number, player2Elo?: number) => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({ onStartGame }) => {
  const { data: session, isPending } = client.useSession();
  const user = session?.user;
  
  const [username, setUsername] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  // Removed unused gameId state

  // Set username from user data if available
  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
    }
  }, [user]);

  // Mock matchmaking for demonstration purposes
  useEffect(() => {
    if (isSearching) {
      // Start timer
      const interval = setInterval(() => {
        setSearchTime((prev) => prev + 1);
      }, 1000);

      // Mock finding a match after a random time (3-8 seconds)
      const mockMatchTimeout = setTimeout(() => {
        if (isSearching) {
          // Simulate finding a match
          const mockOpponent = {
            username: "Opponent",
            elo: Math.max(800, Math.min(1600, (user?.elo || 1200) + Math.floor(Math.random() * 200) - 100))
          };
          
          onStartGame(
            username || "Player",
            mockOpponent.username,
            user?.elo || 1200,
            mockOpponent.elo
          );
          
          setIsSearching(false);
        }
      }, 3000 + Math.random() * 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(mockMatchTimeout);
      };
    }
  }, [isSearching, username, user, onStartGame]);

  const handleStartSearch = () => {
    setIsSearching(true);
    setSearchTime(0);
    // Removed setting gameId
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchTime(0);
    // Removed setting gameId
  };

  // Show loading state
  if (isPending) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Show sign-in prompt if not logged in
  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Ranked Match</CardTitle>
          <CardDescription className="text-center">
            You need to be signed in to play ranked matches
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
          <LogIn className="h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            Sign in to track your progress and compete in the leaderboard
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/sign-up">Create Account</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Find a Ranked Match</CardTitle>
        {user && (
          <CardDescription className="text-center flex items-center justify-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Current ELO: <span className="font-semibold">{user.elo || 1200}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSearching && (
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              You&apos;ll be matched with a player of similar skill level
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                8 min per player
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                ELO rated
              </Badge>
            </div>
          </div>
        )}
        
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="relative bg-primary/10 p-4 rounded-full">
                <Search className="h-8 w-8 text-primary animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Searching for opponent...</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Time elapsed: {Math.floor(searchTime / 60)}:
              {String(searchTime % 60).padStart(2, "0")}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isSearching ? (
          <Button className="w-full flex items-center gap-2" onClick={handleStartSearch}>
            <Search className="h-4 w-4" />
            Find Match
          </Button>
        ) : (
          <Button className="w-full flex items-center gap-2" variant="destructive" onClick={handleCancelSearch}>
            <X className="h-4 w-4" />
            Cancel Search
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
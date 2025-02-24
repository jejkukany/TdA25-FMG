"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [waiting, setWaiting] = useState(false);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    // Game-specific socket events
    socket.on("waitingForPlayer", () => {
      setWaiting(true);
    });

    socket.on("assignPlayer", (symbol) => {
      setPlayer(symbol);
      setWaiting(false);
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("waitingForPlayer");
      socket.off("assignPlayer");
      socket.off("gameState");
    };
  }, []);

  const handleJoinGame = () => {
    socket.emit("joinRoom");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-sm">
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div>

      {!player && !waiting && (
        <button 
          onClick={handleJoinGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Find Game
        </button>
      )}

      {waiting && (
        <p className="text-lg">Waiting for another player...</p>
      )}

      {player && (
        <div className="text-center">
          <p className="text-lg font-bold">You are playing as: {player}</p>
        </div>
      )}
    </div>
  );
}
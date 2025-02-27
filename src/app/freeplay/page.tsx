"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useSearchParams, useRouter } from "next/navigation";
import Board from "@/components/custom//freeplay/Board";
import { Button } from "@/components/ui/button";

export default function Home() {
	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState("N/A");
	const [waiting, setWaiting] = useState(false);
	const [player, setPlayer] = useState(null);
	const [roomId, setRoomId] = useState<string | null>(null);
	const [createdRoom, setCreatedRoom] = useState<string | null>(null);
	const [isHost, setIsHost] = useState(false); // Default to false instead of true
	const searchParams = useSearchParams();
	const router = useRouter();

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
		socket.on("waitingForPlayer", (roomData) => {
			setWaiting(true);
			if (roomData && roomData.roomId) {
				setRoomId(roomData.roomId);
			}
		});

		socket.on("roomCreated", (roomData) => {
			if (roomData && roomData.roomId) {
				setCreatedRoom(roomData.roomId);
				// Automatically join the room after creating it
				socket.emit("joinRoom", { roomId: roomData.roomId });
				setRoomId(roomData.roomId);
				setWaiting(true);
				// Update the URL with the room ID but don't navigate
				// This prevents the host from being redirected immediately
				window.history.replaceState(null, "", `/freeplay?room=${roomData.roomId}`);
			}
		});

		socket.on("playerJoined", (roomData) => {
			// This event is received by the host when a second player joins
			console.log("Player joined the room");
			// The host will automatically receive the assignPlayer event next
		});

		socket.on("assignPlayer", (symbol) => {
			setPlayer(symbol);
			setWaiting(false);
		});

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		// Check if there's a room parameter in the URL
		const roomParam = searchParams.get("room");
		if (roomParam && isConnected) {
			// Join the room specified in the URL
			socket.emit("joinRoom", { roomId: roomParam });
			setRoomId(roomParam);
			setWaiting(true);
			// Mark as guest since they're joining via URL
			setIsHost(false);
		}

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("waitingForPlayer");
			socket.off("roomCreated");
			socket.off("assignPlayer");
			socket.off("gameState");
		};
	}, [searchParams, isConnected, router, isHost]);

	const handleCreateGame = () => {
		socket.emit("createRoom");
		// Mark as host since they're creating the room
		setIsHost(true);
	};

	const copyInviteLink = () => {
		const inviteLink = `${window.location.origin}/freeplay?room=${roomId || createdRoom}`;
		navigator.clipboard.writeText(inviteLink);
		alert("Invite link copied to clipboard!");
	};

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<div className="text-sm mb-4">
				<p>Status: {isConnected ? "connected" : "disconnected"}</p>
				<p>Transport: {transport}</p>
			</div>

			{!player && !waiting && !roomId && !createdRoom && (
				<Button
					onClick={handleCreateGame}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Create Game
				</Button>
			)}
			
			{/* Room creation state is no longer needed as we auto-join */}

			{waiting && (
				<div className="text-center space-y-4">
					<p className="text-lg">Waiting for another player to join...</p>
					{roomId && isHost && (
						<div>
							<p className="mb-2">Room Code: <span className="font-bold">{roomId}</span></p>
							<Button onClick={copyInviteLink}>Copy Invite Link</Button>
						</div>
					)}
					{roomId && !isHost && (
						<div>
							<p className="mb-2">Room Code: <span className="font-bold">{roomId}</span></p>
						</div>
					)}
				</div>
			)}

			{player && (
				<div className="w-full max-w-7xl">
					<div className="text-center mb-4">
						<p className="text-lg font-bold">
							You are playing as: {player}
						</p>
					</div>
					<Board
        				initialBoard={Array.from({ length: 15 }, () => Array(15).fill(""))}
        				playerSymbol={player}
      				/>
				</div>
			)}
		</div>
	);
}

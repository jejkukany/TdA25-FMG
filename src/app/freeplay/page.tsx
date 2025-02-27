"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useSearchParams, useRouter } from "next/navigation";
import Board from "@/components/custom/freeplay/Board";
import { Button } from "@/components/ui/button";
import { client } from "@/server/auth/client";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "../loading";
import { LogIn, Shield, UserPlus } from "lucide-react";

export default function Freeplay() {
	const [isConnected, setIsConnected] = useState(false);
	const [transport, setTransport] = useState("N/A");
	const [waiting, setWaiting] = useState(false);
	const [player, setPlayer] = useState(null);
	const [roomId, setRoomId] = useState<string | null>(null);
	const [createdRoom, setCreatedRoom] = useState<string | null>(null);
	const [isHost, setIsHost] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	
	// Get authentication status
	const { data: sessionData, isPending: isAuthLoading } = client.useSession();
	const isAuthenticated = !!sessionData?.user;

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
				// Ensure isHost is set to true when room is created
				setIsHost(true);
				// Update the URL with the room ID but don't navigate
				// This prevents the host from being redirected immediately
				window.history.replaceState(
					null,
					"",
					`/freeplay?room=${roomData.roomId}`
				);
			}
		});

		socket.on("playerJoined", () => {
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
			// Join the room specified in the URL - allow both authenticated and guest users
			socket.emit("joinRoom", { roomId: roomParam });
			setRoomId(roomParam);
			setWaiting(true);
			// Only set isHost to false if we're joining via URL and haven't created the room
			if (!createdRoom) {
				setIsHost(false);
			}
		}

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("waitingForPlayer");
			socket.off("roomCreated");
			socket.off("assignPlayer");
			socket.off("gameState");
		};
	}, [searchParams, isConnected, router, isAuthenticated]);

	const handleCreateGame = () => {
		socket.emit("createRoom");
		setWaiting(true);
		// Mark as host since they're creating the room
		setIsHost(true);
	};

	const copyInviteLink = () => {
		const inviteLink = `${window.location.origin}/freeplay?room=${
			roomId || createdRoom
		}`;
		navigator.clipboard.writeText(inviteLink);
		alert("Invite link copied to clipboard!");
	};

	// If authentication is still loading, show a loading state
	if (isAuthLoading) {
		return (
			<Loading />
		);
	}

	// Check if there's a room parameter in the URL for guest users
	const roomParam = searchParams.get("room");
	
	// If user is not authenticated and doesn't have a room invite, show login message
	if (!isAuthenticated && !roomParam) {
		return (
		  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
			<Card className="w-full max-w-md border-2 border-primary/10 shadow-lg">
			  <CardHeader className="space-y-1 pb-2">
				<div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
				  <Shield className="h-6 w-6 text-primary" />
				</div>
				<CardTitle className="text-2xl font-bold text-center">Authentication Required</CardTitle>
			  </CardHeader>
			  <CardContent className="text-center pb-4">
				<p className="text-muted-foreground">
				  Trying to create a game to play with your friends? You need to be logged in or sign up.
				</p>
			  </CardContent>
			  <CardFooter className="flex flex-col space-y-3 pt-2">
				<Link href="/sign-in" className="w-full">
				  <Button className="w-full" size="lg">
					<LogIn className="mr-2 h-4 w-4" />
					Sign In
				  </Button>
				</Link>
				<Link href="/sign-up" className="w-full">
				  <Button variant="outline" className="w-full" size="lg">
					<UserPlus className="mr-2 h-4 w-4" />
					Sign Up
				  </Button>
				</Link>
			  </CardFooter>
			</Card>
		  </div>
		)
	  }

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<div className="text-sm mb-4">
				<p>Status: {isConnected ? "connected" : "disconnected"}</p>
				<p>Transport: {transport}</p>
				<p>Host Status: {isHost ? "Host" : "Guest"}</p>
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
					<p className="text-lg">
						Waiting for another player to join...
					</p>
					{roomId && isHost && (
						<div>
							<p className="mb-2">
								Room Code:{" "}
								<span className="font-bold">{roomId}</span>
							</p>
							<Button onClick={copyInviteLink}>
								Copy Invite Link
							</Button>
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
						initialBoard={Array.from({ length: 15 }, () =>
							Array(15).fill("")
						)}
						playerSymbol={player}
					/>
				</div>
			)}
		</div>
	);
}

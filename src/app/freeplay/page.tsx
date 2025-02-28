"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useSearchParams, useRouter } from "next/navigation";
import Board from "@/components/custom/freeplay/Board";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
	const [isConnected, setIsConnected] = useState(false);
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
		}

		function onDisconnect() {
			setIsConnected(false);
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

	const copyCurrentUrl = () => {
		navigator.clipboard.writeText(window.location.href);
		toast.success("URL copied to clipboard!");
	};

	return (
		<div>
			{!player && (
				<div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
					<Card className="w-full max-w-md shadow-xl">
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-center">
								Free Play Mode
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="mb-4">
								<Badge
									variant={
										isConnected ? "success" : "destructive"
									}
									className="w-full justify-center py-1.5"
								>
									{isConnected
										? "Ready to Play"
										: "Connecting..."}
								</Badge>
							</div>

							{!player && !waiting && !roomId && !createdRoom && (
								<Button
									onClick={handleCreateGame}
									className="w-full"
									size="lg"
									variant="default"
								>
									Create New Game
								</Button>
							)}

							{waiting && (
								<div className="space-y-4 text-center">
									<div className="animate-pulse">
										<p className="text-lg font-medium">
											Waiting for another player to
											join...
										</p>
									</div>
									{roomId && (
										<Card className="bg-secondary/30">
											<CardContent className="pt-6">
												<p className="mb-2">
													Share this link:
												</p>

												<div className="flex w-full items-center space-x-2 mb-4">
													<Input
														value={
															window.location.href
														}
														readOnly
														className="font-mono text-sm text-center bg-background/50"
													/>
													<Button
														onClick={copyCurrentUrl}
														size="icon"
														variant="outline"
														className="shrink-0"
													>
														<Copy className="h-4 w-4" />
													</Button>
												</div>

												<div className="flex flex-col items-center gap-4 mt-4">
													<div className="bg-white p-2 rounded-lg">
														<QRCodeSVG
															value={
																window.location
																	.href
															}
															size={200}
														/>
													</div>
												</div>
											</CardContent>
										</Card>
									)}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}

			{player && (
				<div className="2xl:px-4 w-full flex flex-col lg:justify-center xl:mt-[-28px] lg:min-h-screen">
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

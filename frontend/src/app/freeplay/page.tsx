"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { client } from "@/server/auth/client"; // Replace with your actual auth library
import Loading from "../loading";

const socket = io(
	process.env.NODE_ENV === "production"
		? process.env.BETTER_AUTH_URL + ":4000"
		: "http://localhost:4000"
);

export default function TicTacToeLobby() {
	const [player, setPlayer] = useState(null);
	const [roomJoined, setRoomJoined] = useState(false);
	const [waiting, setWaiting] = useState(false);
	const { data: session, isPending } = client.useSession();
	console.log("This is a session:", session);

	useEffect(() => {
		socket.on("assignPlayer", (symbol) => {
			setPlayer(symbol);
			setWaiting(false);
		});

		socket.on("waitingForPlayer", () => {
			setWaiting(true);
		});
	}, []);

	const joinRoom = () => {
		socket.emit("joinRoom");
		setRoomJoined(true);
		setWaiting(true);
	};

	if (isPending) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-2xl font-bold">Tic Tac Toe Lobby</h1>
			{!roomJoined ? (
				<button
					onClick={joinRoom}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
				>
					Join Game
				</button>
			) : waiting ? (
				<p className="mt-4">Waiting for another player...</p>
			) : (
				<>
					<p className="mt-4">You are playing as: {player}</p>
					{session ? (
						<p className="mt-4">
							Logged in as: {session.user.name}
						</p>
					) : (
						<p className="mt-4">You are playing as a guest</p>
					)}
				</>
			)}
		</div>
	);
}

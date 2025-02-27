const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer, {
		cors: {
			origin: true,
			methods: ["GET", "POST"],
			transports: ["websocket", "polling"],
			allowEIO3: true,
		},
	});

	const rooms = new Map();

	io.on("connection", (socket) => {
		console.log("A user connected:", socket.id);

		socket.on("createRoom", () => {
			// Generate a random 6-digit room ID between 100000-999999
			const roomId = Math.floor(
				100000 + Math.random() * 900000
			).toString();
			rooms.set(roomId, {
				players: [],
				board: createEmptyBoard(),
				currentPlayer: "X",
				host: socket.id,
			});
			socket.emit("roomCreated", { roomId });
		});

		socket.on("joinRoom", ({ roomId }) => {
			const room = rooms.get(roomId);
			if (!room) {
				socket.emit("error", "Room not found");
				return;
			}
			if (room.players.length >= 2) {
				socket.emit("error", "Room is full");
				return;
			}

			// Check if this socket is already in the room to prevent duplicate entries
			if (!room.players.includes(socket.id)) {
				room.players.push(socket.id);
			}
			socket.join(roomId);

			// Always emit waitingForPlayer if there's only one player
			if (room.players.length === 1) {
				socket.emit("waitingForPlayer", { roomId });
			}
			// Only start the game when a second player joins
			else if (room.players.length === 2) {
				// Second player joining, start the game
				// Assign X to first player and O to second player
				const firstPlayerSocket = room.players[0];
				const secondPlayerSocket = room.players[1];

				// Notify the host that a player has joined
				io.to(room.host).emit("playerJoined", { roomId });

				// Wait a short time before assigning players to ensure the playerJoined event is processed
				setTimeout(() => {
					// Send individual player assignments
					io.to(firstPlayerSocket).emit("assignPlayer", "X");
					io.to(secondPlayerSocket).emit("assignPlayer", "O");

					// Start the game
					io.to(roomId).emit("gameState", {
						board: room.board,
						currentPlayer: room.currentPlayer,
					});
				}, 1000); // 1 second delay
			}
		});

		socket.on("makeMove", ({ gameId, row, col }) => {
			const room = rooms.get(gameId);
			if (!room) return;

			const index = row * 15 + col;
			if (
				room.board[row][col] === "" &&
				room.players[room.currentPlayer === "X" ? 0 : 1] === socket.id
			) {
				room.board[row][col] = room.currentPlayer;
				room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";

				io.to(gameId).emit("gameState", {
					board: room.board,
					currentPlayer: room.currentPlayer,
				});
			}
		});

		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
			for (const [roomId, room] of rooms.entries()) {
				if (room.players.includes(socket.id)) {
					room.players = room.players.filter(
						(id) => id !== socket.id
					);
					if (room.players.length === 0) {
						rooms.delete(roomId);
					} else {
						io.to(roomId).emit("playerLeft", {
							board: room.board,
							currentPlayer: room.currentPlayer,
						});
					}
				}
			}
		});
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://localhost:${port}`);
		});
});

function createEmptyBoard() {
	return Array(15)
		.fill(null)
		.map(() => Array(15).fill(""));
}

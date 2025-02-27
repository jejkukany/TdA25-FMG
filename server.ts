import { createServer } from "node:http";
import next from "next";
import { Server, Socket } from "socket.io";

interface GameRoom {
	players: Socket[];
	board: (string | null)[];
	turn: "X" | "O";
	winner?: "X" | "O" | null;
}

interface GameState {
	board: (string | null)[];
	turn: "X" | "O";
	winner?: "X" | "O" | null;
}

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer);
	const rooms: Record<string, GameRoom> = {};

	io.on("connection", (socket) => {
		// ...
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

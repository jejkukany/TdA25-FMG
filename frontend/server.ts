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

const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  const rooms: Record<string, GameRoom> = {};

  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", () => {
      let room = Object.keys(rooms).find(
        (r) => rooms[r].players.length < 2
      );
      if (!room) {
        room = socket.id;
        rooms[room] = {
          players: [],
          board: Array(25).fill(null),
          turn: "X",
        };
      }

      rooms[room].players.push(socket);
      socket.join(room);

      if (rooms[room].players.length === 1) {
        socket.emit("waitingForPlayer");
      } else if (rooms[room].players.length === 2) {
        rooms[room].players[0].emit("assignPlayer", "X");
        rooms[room].players[1].emit("assignPlayer", "O");
        io.to(room).emit("gameState", {
          board: rooms[room].board,
          turn: rooms[room].turn,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Clean up rooms when players disconnect
      Object.keys(rooms).forEach((roomId) => {
        rooms[roomId].players = rooms[roomId].players.filter((p) => p.id !== socket.id);
        if (rooms[roomId].players.length === 0) {
          delete rooms[roomId];
        }
      });
    });
  });

  httpServer
    .once("error", (err: Error) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

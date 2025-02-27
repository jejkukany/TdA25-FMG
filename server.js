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
      transports: ['websocket', 'polling'],
      allowEIO3: true,
    },
  });

  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", () => {
      let roomId = null;
      
      // Find an available room or create new one
      for (const [id, room] of rooms.entries()) {
        if (room.players.length < 2) {
          roomId = id;
          break;
        }
      }

      if (!roomId) {
        roomId = socket.id;
        rooms.set(roomId, {
          players: [],
          board: createEmptyBoard(),
          currentPlayer: "X"
        });
      }

      const room = rooms.get(roomId);
      room.players.push(socket.id);
      socket.join(roomId);

      if (room.players.length === 1) {
        socket.emit("waitingForPlayer");
      } else if (room.players.length === 2) {
        io.to(room.players[0]).emit("assignPlayer", "X");
        io.to(room.players[1]).emit("assignPlayer", "O");
        io.to(roomId).emit("gameState", {
          board: room.board,
          currentPlayer: room.currentPlayer
        });
      }
    });

    socket.on("makeMove", ({ gameId, row, col }) => {
      const room = rooms.get(gameId);
      if (!room) return;

      const index = row * 15 + col;
      if (room.board[row][col] === null && 
          room.players[room.currentPlayer === "X" ? 0 : 1] === socket.id) {
        
        room.board[row][col] = room.currentPlayer;
        room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";

        io.to(gameId).emit("gameState", {
          board: room.board,
          currentPlayer: room.currentPlayer
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [roomId, room] of rooms.entries()) {
        if (room.players.includes(socket.id)) {
          room.players = room.players.filter(id => id !== socket.id);
          if (room.players.length === 0) {
            rooms.delete(roomId);
          } else {
            io.to(roomId).emit("playerLeft", {
              board: room.board,
              currentPlayer: room.currentPlayer
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
  return Array(15).fill(null).map(() => Array(15).fill(null));
}

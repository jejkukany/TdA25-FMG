import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  let rooms = {};

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", () => {
      let room = Object.keys(rooms).find((r) => rooms[r].players.length < 2);
      if (!room) {
        room = socket.id;
        rooms[room] = { players: [], board: Array(25).fill(null), turn: "X" };
      }

      rooms[room].players.push(socket);
      socket.join(room);

      if (rooms[room].players.length === 1) {
        socket.emit("waitingForPlayer");
      } else if (rooms[room].players.length === 2) {
        rooms[room].players[0].emit("assignPlayer", "X");
        rooms[room].players[1].emit("assignPlayer", "O");
        io.to(room).emit("gameState", { board: rooms[room].board, turn: rooms[room].turn });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
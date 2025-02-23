const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("Tic-Tac-Toe Server is running.");
});

let rooms = {}; // Store active game rooms

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", () => {
    let room = Object.keys(rooms).find((r) => rooms[r].players.length < 2);
    if (!room) {
      room = socket.id; // Use socket ID as room name
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

    socket.on("makeMove", (index) => {
      if (rooms[room].board[index] === null && rooms[room].players[rooms[room].turn === "X" ? 0 : 1] === socket) {
        rooms[room].board[index] = rooms[room].turn;
        rooms[room].turn = rooms[room].turn === "X" ? "O" : "X";

        let winner = checkWinner(rooms[room].board);
        if (winner) rooms[room].winner = winner;

        io.to(room).emit("gameState", {
          board: rooms[room].board,
          turn: rooms[room].turn,
          winner: rooms[room].winner || null,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      rooms[room].players = rooms[room].players.filter((p) => p !== socket);
      if (rooms[room].players.length === 0) {
        delete rooms[room];
      }
    });
  });
});

function checkWinner(board) {
  const winPatterns = generateWinPatterns();
  
  for (let pattern of winPatterns) {
    const [a, b, c, d, e] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d] && board[a] === board[e]) {
      return board[a];
    }
  }
  return null;
}

function generateWinPatterns() {
  let patterns = [];
  
  // Rows
  for (let i = 0; i < 25; i += 5) {
    for (let j = 0; j < 1; j++) {
      patterns.push([i + j, i + j + 1, i + j + 2, i + j + 3, i + j + 4]);
    }
  }

  // Columns
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 1; j++) {
      patterns.push([i + j * 5, i + (j + 1) * 5, i + (j + 2) * 5, i + (j + 3) * 5, i + (j + 4) * 5]);
    }
  }

  // Diagonal (")
  patterns.push([0, 6, 12, 18, 24]);
  patterns.push([4, 8, 12, 16, 20]);

  return patterns;
}

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
require('dotenv').config();

const { Server } = require("socket.io");

const PORT = process.env.PORT || 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const io = new Server(PORT, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

console.log(`Signalling server starting (env: ${process.env.NODE_ENV || 'development'}) on port ${PORT}`);
console.log(`CORS allowed origin: ${CORS_ORIGIN}`);

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  // Join a room
  socket.on("join-room", ({ roomId }) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);

    // notify others in the room that a peer joined
    socket.to(roomId).emit("peer-joined", { peerId: socket.id });

    // optionally reply to the joiner with a joined ack
    socket.emit("joined", { roomId });
  });

  // Forward offer to other peers in the room
  socket.on("offer", ({ roomId, offer, to }) => {
    if (!roomId || !offer) return;
    console.log(`${socket.id} -> offer to room ${roomId} ${to ? "to:"+to : ""}`);
    if (to) {
      io.to(to).emit("offer", { offer, from: socket.id });
    } else {
      socket.to(roomId).emit("offer", { offer, from: socket.id });
    }
  });

  // Forward answer to other peers in the room
  socket.on("answer", ({ roomId, answer, to }) => {
    if (!roomId || !answer) return;
    if (to) {
      io.to(to).emit("answer", { answer, from: socket.id });
    } else {
      socket.to(roomId).emit("answer", { answer, from: socket.id });
    }
  });

  // Forward ICE candidates to other peers in the room
  socket.on("ice-candidate", ({ roomId, candidate, to }) => {
    if (!roomId || !candidate) return;
    if (to) {
      io.to(to).emit("ice-candidate", { candidate, from: socket.id });
    } else {
      socket.to(roomId).emit("ice-candidate", { candidate, from: socket.id });
    }
  });

  // Clean up on disconnect and notify peers
  socket.on("disconnect", (reason) => {
    console.log("socket disconnected", socket.id, reason);
    // socket.rooms contains all rooms this socket belongs to (including a room with socket.id)
    for (const roomId of socket.rooms) {
      if (roomId === socket.id) continue;
      socket.to(roomId).emit("peer-left", { peerId: socket.id });
    }
  });
});

console.log(`Signalling server running on port ${PORT}`);
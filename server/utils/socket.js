import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Replace with your frontend URL
    methods: ["GET", "POST"], // Important: Add the methods
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit online user list

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated online user list
  });

  // *** NEW: Room-based message handling ***
  socket.on("joinRoom", ({ roomId }) => {
    console.log(`User ${userId} joined room: ${roomId}`);
    socket.join(roomId); // Join the socket to the room
  });

  socket.on("sendMessage", (message, roomId) => {
    console.log(`Message from ${userId} to room ${roomId}:`, message);
    io.to(roomId).emit("newMessage", message); // Emit to the room
  });
});

export { io, server, app };

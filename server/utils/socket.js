import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5000"], // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map(); // Use a Map

function getReceiverSocketId(receiverId) {
  return userSocketMap.get(receiverId);
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    userSocketMap.set(userId, socket.id);
  } else {
    console.log("Connection attempt without userId. Disconnecting.");
    socket.disconnect(true);
    return;
  }

  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
    userSocketMap.delete(userId);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });

  // Handle "sendMessage" events (important)
  socket.on("sendMessage", (newMessage) => {
    console.log("Server received message:", newMessage);
    const receiverSocketId = getReceiverSocketId(newMessage.receiverId);
    const senderSocketId = getReceiverSocketId(newMessage.senderId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      console.log("Message sent to receiver");
    } else {
      console.log("Receiver is offline or not found:", newMessage.receiverId);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
      console.log("Message sent to sender");
    } else {
      console.log("Sender is offline or not found:", newMessage.senderId);
    }
  });
});

// Make sure io is available to your controllers (if you're using it there)
export { app, io, server };

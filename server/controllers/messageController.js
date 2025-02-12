import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getReceiverSocketId, io } from "../utils/socket.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res, next) => {
  const { text } = req.body;
  const receiverId = req.params.id;
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Sender ID is required (user not authenticated)." });
  }
  const senderId = req.user.id;
  console.log("Receiver ID (backend):", receiverId);
  try {
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);

    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

export const getMessage = async (req, res, next) => {
  console.log("🟢 Checking req.user.id:", req.user.id);
  console.log("🟢 Checking req.params.id:", req.params.id);

  try {
    console.log("🔹 Checking req.user:", req.user);
    console.log("🔹 Checking req.user:", req.params);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const myId = req.user.id;
    const userToChatId = req.params.id;

    if (!userToChatId) {
      return res.status(400).json({ message: "Receiver ID is required." });
    }

    // Validate MongoDB ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(myId) ||
      !mongoose.Types.ObjectId.isValid(userToChatId)
    ) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean(); // Improve performance by returning plain JavaScript objects

    if (!messages || messages.length === 0) {
      console.log("⚠️ No messages found between users.");
      return res.status(200).json([]); // Return an empty array instead of 404
    }

    console.log("✅ Messages from DB:", messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const loggedInUser = req.user.id;
  try {
    const filteredUser = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    res.status(200).json(filteredUser);
  } catch (error) {
    console.error("error in getting user", error.message);
    next(error);
  }
};

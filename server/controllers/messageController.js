import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { Listing } from "../models/listingModel.js";
import User from "../models/userModel.js";

export const sendMessage = async (req, res) => {
  try {
    console.log("Incoming request to sendMessage...");
    const { message } = req.body;
    const { id: receiverId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const senderId = req.user.id;

    if (receiverId === senderId) {
      return res.status(400).json({ error: "Invalid receiver ID" });
    }

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get messages between two users
export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } },
      populate: {
        path: "senderId",
        select: "username image", // Include additional fields if needed
      },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get users the current user has had conversations with
export const getUsersWithMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const currentUserId = req.user.id;

    const conversations = await Conversation.find({
      participants: { $in: [currentUserId] },
    }).populate({
      path: "participants",
      match: { _id: { $ne: currentUserId } },
      select: "username _id image",
    });

    const users = [];
    const userIds = new Set();

    for (const conversation of conversations) {
      if (conversation.participants.length > 0) {
        const otherUser = conversation.participants[0];
        if (otherUser && !userIds.has(otherUser._id.toString())) {
          users.push(otherUser);
          userIds.add(otherUser._id.toString());
        }
      }
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersWithMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetUsersWithListings = async (req, res, next) => {
  try {
    // Step 1: Find all unique userRef IDs from the listings
    const listings = await Listing.find().select("userRef");

    const uniqueUserIds = [...new Set(listings.map((item) => item.userRef.toString()))];

    // Step 2: Fetch users who match those IDs
    const users = await User.find({ _id: { $in: uniqueUserIds } }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};



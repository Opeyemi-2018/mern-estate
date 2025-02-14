import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    console.log("Incoming request to sendMessage...");

    console.log("Request Body:", req.body);
    const { message } = req.body;
    let { id: receiverId } = req.params;

    if (!req.user) {
      console.error("Error: req.user is undefined");
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const senderId = req.user.id;

    console.log("Sender ID:", senderId);
    console.log("Receiver ID before validation:", receiverId);

    // If receiverId is the same as senderId, correct it
    if (receiverId === senderId) {
      console.error("Error: Receiver ID is the same as sender ID");
      return res.status(400).json({ error: "Invalid receiver ID" });
    }

    console.log("Validated Receiver ID:", receiverId);

    if (!senderId || !receiverId || !message) {
      console.error("Validation Error: Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    console.log("Existing conversation found:", conversation ? "Yes" : "No");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
      console.log("New conversation created:", conversation);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    console.log("New message created:", newMessage);

    if (!newMessage) {
      console.error("Error: Message object was not created properly");
      return res.status(500).json({ error: "Failed to create message" });
    }

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);
    console.log("Message and conversation saved successfully");

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    console.log(`Fetching messages between ${senderId} and ${userToChatId}`);

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, // Sort messages by creation time
    });

    if (!conversation) {
      console.log("No conversation found between these users.");
      return res.status(200).json([]);
    }

    console.log("Messages retrieved:", conversation.messages);

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsersWithMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const currentUserId = req.user.id;

    // Find conversations where the current user is a participant
    const conversations = await Conversation.find({
      participants: { $in: [currentUserId] }, // $in finds any of the values in the array
    }).populate({
      path: "participants",
      match: { _id: { $ne: currentUserId } }, // Exclude the current user from participants, only return the other user
      select: "username _id image", // Select the fields you need
    });

    // Extract the other users from the conversations (and remove duplicates)
    const users = [];
    const userIds = new Set(); // Use a Set to track user IDs and prevent duplicates

    for (const conversation of conversations) {
      if (conversation.participants.length > 0) {
        // Check if other participant exists (important!)
        const otherUser = conversation.participants[0];
        if (!userIds.has(otherUser._id.toString())) {
          // Check for duplicates using string conversion
          users.push(otherUser);
          userIds.add(otherUser._id.toString());
        }
      }
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersWithMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

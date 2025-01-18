import { Message } from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

export const sendMessage = async (req, res, next) => {
  const { text } = req.body;
  const receiverId = req.params._id;
  const senderId = req.user._id;
  try {
    const newMessage = await new Message.create({
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
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  const myId = req.user._id;
  const userToChatId = req.params._id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
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

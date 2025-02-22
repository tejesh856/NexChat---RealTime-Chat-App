import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import createError from "http-errors";

export const getUsersForSidebar = async (req, res, next) => {
  try {
    const loggedinUserId = req.user.id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedinUserId },
    }).select("-password");
    res.json({
      success: true,
      users: filteredUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const UserId = req.user.id;
    const { id } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: UserId, receiverId: id },
        { senderId: id, receiverId: UserId },
      ],
    });
    res.json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessages = async (req, res, next) => {
  try {
    const UserId = req.user.id;
    const { id } = req.params;
    const { text, image } = req.body;
    if (!text && !image) {
      throw createError.NotFound("message is empty");
    }
    const message = await Message.create({
      senderId: UserId,
      receiverId: id,
      text: text,
      image: image,
    });

    const receiverSocketId = getReceiverSocketId(id);
    const senderSocketId = getReceiverSocketId(UserId);

    // Emit to both parties
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", message);
    }

    res.json({
      success: true,
      message: message,
    });
  } catch (error) {
    next(error);
  }
};

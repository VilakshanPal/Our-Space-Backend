import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { chatAuth } from "../middlewares/connection.js";
import { sendMessage, getMessages, editMessage, deleteMessage } from "../services/message.js";

export const chatRouter = express.Router();

//* CREATE MESSAGE
chatRouter.post("/message", userAuth, chatAuth, async (req, res) => {
  try {
    const { textMessage } = req.body;
    const chatId = req.chat.id;
    const senderId = req.user.id;
    const message = await sendMessage(textMessage, chatId, senderId);
    return res.status(200).json({
      status: "Success",
      message: "Message sent",
      details: message,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});

//* READ MESSAGE
chatRouter.get("/messages", userAuth, chatAuth, async (req, res) => {
  try {
    const cursor = req.query.cursor ? req.query.cursor : undefined;
    const chatId = req.chat.id
    const messages = await getMessages(chatId,cursor);
    return res.status(200).json({
      status: "Success",
      message: "Messages Fetched",
      details: messages,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});

//* EDIT MESSAGE
chatRouter.patch("/message/:id", userAuth, chatAuth, async (req, res) => {
  try {
    const { textMessage } = req.body;
    const {id} = req.params;
    const senderId = req.user.id;
    const editedMessage = await editMessage(textMessage, id, senderId);
    return res.status(200).json({
      status: "Success",
      message: "Message sent",
      details: editedMessage,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});

//* DELETE MESSAGE
chatRouter.delete("/message/:id", userAuth, chatAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const senderId = req.user.id;
    const deletedMessage = await deleteMessage(id, senderId);
    return res.status(200).json({
      status: "Success",
      message: "Message Deleted",
      details: deletedMessage,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});

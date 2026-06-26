import { Server } from "socket.io";
import { sendMessage } from "../services/message.js";

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-chat", (data) => handleJoinChat(socket, data));

    socket.on("send-message", (data) => handleSendMessage(data));

    socket.on("typing", (data) => handleTyping(socket, data));

    socket.on("stop-typing", (data) => handleStopTyping(socket, data));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

//! validate JWT
//! validate user belongs to chat
function handleJoinChat(socket, data) {
  socket.join(data.chatId);

  console.log(`Socket ${socket.id} joined chat ${data.chatId}`);
}

async function handleSendMessage(data) {
  try {
    //     const message = await sendMessage(
    //       data.textMessage,
    //       data.chatId,
    //       data.senderId
    //     );

    const message = data.message;

    io.to(data.chatId).emit("new-message", message);
  } catch (error) {
    console.error("Send Message Error:", error);
  }
}

function handleTyping(socket, data) {
  socket.to(data.chatId).emit("connection-typing", {
    typing: true,
  });
}

function handleStopTyping(socket, data) {
  socket.to(data.chatId).emit("connection-stop-typing", {
    typing: false,
  });
}

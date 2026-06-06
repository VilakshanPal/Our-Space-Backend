import { skip } from "node:test";
import { prisma } from "../config/prisma.ts";

//* CREATE MESSAGE
export async function sendMessage(textMessage, chatId, senderId) {
  const message = await prisma.message.create({
    data: {
      textMessage: textMessage,
      chatId,
      senderId,
    },
  });

  if (!message) {
    throw new Error("Message Not Sent");
  }
  return message;
}

//* GET MESSAGES
export async function getMessages(chatId, cursor) {
  const messages = await prisma.message.findMany({
    where: {
      chatId,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          profilePicture: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 25,
    ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),
    orderBy: {
      createdAt: "desc",
    },
  });
  if(!messages){
    throw new Error("No message")
  }

  return messages;
}

export async function editMessage(textMessage, id, senderId) {}

export async function deleteMessage(textMessage, senderId) {}

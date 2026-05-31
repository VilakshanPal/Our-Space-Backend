import { prisma } from "../config/prisma.ts";

//* CREATE CONNECTION REQUEST
export async function createConnectionRequest(fromUserId, toUserId) {
  const senderConnection = await prisma.user.findUnique({
    where: { id: fromUserId },
    select: { connectionId: true },
  });

  if (senderConnection?.connectionId) {
    throw new Error("You already have an active connection");
  }

  const receiverConnection = await prisma.user.findUnique({
    where: { id: Number(toUserId) },
    select: { connectionId: true },
  });

  if (receiverConnection?.connectionId) {
    throw new Error("This user already has an active connection");
  }

  const duplicateRequest = await prisma.connectionRequest.findFirst({
    where: {
      connectionStatus: "pending",
      OR: [
        {
          senderId: Number(toUserId),
          receiverId: fromUserId,
        },
        {
          senderId: fromUserId,
          receiverId: Number(toUserId),
        },
      ],
    },
  });

  if (duplicateRequest) {
    throw new Error("Duplicate Request Found");
  }

  const request = await prisma.connectionRequest.create({
    data: {
      senderId: fromUserId,
      receiverId: Number(toUserId),
      connectionStatus: "pending",
    },
  });

  return request;
}

//* ACCEPT CONNECTION REQUEST & CREATE CONNECTION
export async function acceptConnectionRequest(connectionId, currentUserId) {
  const connectionRequest = await prisma.connectionRequest.findFirst({
    where: {
      id: Number(connectionId),
      connectionStatus: "pending",
      receiverId: currentUserId,
    },
  });

  if (!connectionRequest) {
    throw new Error("Pending Connection request not found");
  }

  const senderConnection = await prisma.user.findUnique({
    where: { id: connectionRequest.senderId },
    select: { connectionId: true },
  });

  const receiverConnection = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: { connectionId: true },
  });

  if (senderConnection?.connectionId || receiverConnection?.connectionId) {
    throw new Error("One of the users already has an active connection");
  }

  const newConnection = await prisma.$transaction(async (tx) => {
    const connection = await tx.connection.create({
      data: {
        status: "active",
        users: {
          connect: [
            { id: connectionRequest.senderId },
            { id: currentUserId },
          ],
        },
      },
      include: { users: true },
    });

    await tx.dayBook.create({
      data:{
        connectionId: connection.id,
      }
    })

    await tx.connectionRequest.update({
      where: {
        id: connectionRequest.id,
      },
      data: {
        connectionStatus: "accepted",
      },
    });

    return connection;
  });

  return newConnection;
}

//* REJECT CONNECTION REQUEST
export async function rejectConnectionRequest(connectionId, currentUserId) {
  const connectionRequest = await prisma.connectionRequest.findFirst({
    where: {
      id: connectionId,
      receiverId: currentUserId,
      connectionStatus: "pending",
    },
  });

  if (!connectionRequest) {
    throw new Error("Pending Connection request not found");
  }

  const updatedRequest = await prisma.connectionRequest.update({
    where: {
      id: connectionId,
    },
    data: {
      connectionStatus: "rejected",
    },
  });

  return updatedRequest;
}

//* DELETE CONNECTION REQUEST
export async function deleteConnectionRequest(connectionId, currentUserId) {
  const connectionRequest = await prisma.connectionRequest.findFirst({
    where: {
      id: connectionId,
      OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    },
  });

  if (!connectionRequest) {
    throw new Error("Connection request not found");
  }

  const deletedRequest = await prisma.connectionRequest.delete({
    where: {
      id: connectionId,
    },
  });

  return deletedRequest;
}
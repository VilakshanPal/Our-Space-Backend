import { prisma } from "../config/prisma.ts";
import cloudinary from "../config/cloudinary.js";

// * CREATE MOMENTS
export async function createMoment(textMessage, media, authorId, dayBookId) {
  console.log('test')
  console.log(textMessage, media, authorId, dayBookId)

  let cloudinaryImg = null;
  if (media) {
    cloudinaryImg = await cloudinary.uploader.upload(media);
  }

  const moment = await prisma.moment.create({
    data: {
      textMessage,
      authorId,
      dayBookId: dayBookId,
      imgUrl: cloudinaryImg?.secure_url || null,
    },
  });
  return moment;
}

// * READ MOMENTS
export async function getMoments(dayBookId, cursor) {
  const moments = await prisma.moment.findMany({
    where: {
      dayBookId: dayBookId,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          profilePicture: true,
        },
      },
      momentReplies: {
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              profilePicture: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
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

  return moments;
}

// *UPDATE MOMENTS
export async function editMoment(momentId, userId, dayBookId, textMessage) {
  const cleanText = textMessage?.trim();

  if (!cleanText) {
    throw new Error("Moment text is required");
  }

  const moment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      authorId: userId,
      dayBookId,
    },
  });

  if (!moment) {
    throw new Error("Moment not found");
  }

  return prisma.moment.update({
    where: {
      id: moment.id,
    },
    data: {
      textMessage: cleanText,
    },
  });
}

// * DELETE MOMENT
export async function deleteMoment(momentId, userId, dayBookId) {
  const moment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      authorId: userId,
      dayBookId,
    },
  });

  if (!moment) {
    throw new Error("Moment not found");
  }
  const deletedMoment = await prisma.moment.delete({
    where: {
      id: moment?.id,
    },
  });
  if (!deletedMoment) {
    throw new Error("Moment not deleted");
  }
  return deletedMoment;
}

//* CREATE MOMENT REPLY
export async function createReply(replyText, momentId, userId, dayBookId) {
  const cleanReply = replyText?.trim();

  if (!cleanReply) {
    throw new Error("Reply text is required");
  }
  const moment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      dayBookId,
    },
  });

  if (!moment) {
    throw new Error("Moment not found");
  }

  const reply = await prisma.momentReply.create({
    data: {
      replyText: cleanReply,
      momentId,
      authorId: userId,
    },
  });
  if (!reply) {
    throw new Error("reply not sent");
  }
  return reply;
}

// *READ MOMENT REPLY
export async function getReplies(momentId, dayBookId, cursor) {
  const moment = await prisma.moment.findFirst({
    where: {
      id: momentId,
      dayBookId,
    },
  });

  if (!moment) {
    throw new Error("Moment not found");
  }

  const replies = await prisma.momentReply.findMany({
    where: {
      momentId: moment.id,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          profilePicture: true,
        },
      },
    },
    take: 25,
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),
    orderBy: {
      createdAt: "asc",
    },
  });
  return replies;
}

// * UPDATE MOMENT REPLY
export async function editReply(replyId, userId, replyText) {
  const cleanReply = replyText?.trim();

  if (!cleanReply) {
    throw new Error("Reply text is required");
  }

  const reply = await prisma.momentReply.findFirst({
    where: {
      id: replyId,
      authorId: userId,
    },
  });

  if (!reply) {
    throw new Error("Reply not found");
  }

  return prisma.momentReply.update({
    where: {
      id: reply.id,
    },
    data: {
      replyText: cleanReply,
    },
  });
}

// * DELETE MOMENT REPLY
export async function deleteReply(replyId, userId) {
  const momentreply = await prisma.momentReply.findFirst({
    where: {
      id: replyId,
      authorId: userId,
    },
  });

  if (!momentreply) {
    throw new Error("Reply not found");
  }
  const deletedReply = await prisma.momentReply.delete({
    where: {
      id: momentreply?.id,
    },
  });
  if (!deletedReply) {
    throw new Error("Moment Reply not deleted");
  }
  return deletedReply;
}

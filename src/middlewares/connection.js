import { prisma } from "../config/prisma.ts";

export async function dayBookAuth(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        connection: {
          include: {
            dayBook: true,
          },
        },
      },
    });

    if (!user?.connection) {
      throw new Error("No active connection found");
    }

    if (user.connection.status !== "active") {
      throw new Error("Connection is not active");
    }

    if (!user.connection.dayBook) {
      throw new Error("DayBook not found");
    }

    req.connection = user.connection;
    req.dayBook = user.connection.dayBook;

    next();
  } catch (err) {
    return res.status(403).json({
      status: "Error",
      message: err.message,
    });
  }
}

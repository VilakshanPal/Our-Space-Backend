import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.ts";

// Identify user
export async function userAuth(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Authentication token missing");
    }
    const cookiePayload = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: cookiePayload.data.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        connectionId: true,
      },
    });
    if (!user) {
      throw new Error("Unauthenticated Request");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      status: "Error",
      message: "Unauthenticated Request",
      detail: err.message,
    });
  }
}

import express from "express";
import { prisma } from "../config/prisma.ts";

import { userAuth } from "../middlewares/auth.js";
import {
  createConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  deleteConnectionRequest,
} from "../services/connection.js";

export const connectionRouter = express.Router();

//* Create connectionRequest
connectionRouter.post(
  "/connection/send/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { toUserId } = req.params;
      const user = req.user;
      const fromUserId = user.id;

      if (user.id == toUserId) {
        throw new Error("Sender & Receiver cannot be same");
      }

      const request = await createConnectionRequest(fromUserId, toUserId);
      if (!request) {
        throw new Error("Request Failed");
      }
      res.status(201).json({
        status: "Success",
        message: "Connection request sent",
        details: request,
      });
    } catch (err) {
      res.status(400).json({
        status: "Error",
        message: "Request Failed",
        details: err.message,
      });
    }
  },
);

//*Update connectionRequest { accept , reject}
connectionRouter.post("/connection/:id/:status", userAuth, async (req, res) => {
  try {
    const { id, status } = req.params;
    const connectionId = Number(id);
    const currentUserId = req.user.id;
    const ALLOWED_STATUS = ["accept", "reject"];

    if (!ALLOWED_STATUS.includes(status)) {
      throw new Error("Invalid Status");
    }

    let result;

    if (status === "accept") {
      result = await acceptConnectionRequest(connectionId, currentUserId);
    } else if (status === "reject") {
      result = await rejectConnectionRequest(connectionId, currentUserId);
    }

    res.status(200).json({
      status: "Success",
      message: "Request updated Successfully",
      details: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});

//* Delete connectionRequest
connectionRouter.delete(
  "/connection/:id/delete",
  userAuth,
  async (req, res) => {
    try {
      const { id } = req.params;
      const connectionId = Number(id);
      const currentUserId = req.user.id;
      const deletedRequest = await deleteConnectionRequest(
        connectionId,
        currentUserId,
      );
      if (!deletedRequest) {
        throw new Error("Request not deleted");
      }

      res.status(200).json({
        status: "Success",
        message: "Request Deleted Successfully",
        details: deletedRequest,
      });
    } catch (err) {
      res.status(400).json({
        status: "Error",
        message: "Request Failed",
        details: err.message,
      });
    }
  },
);

connectionRouter.get("/partner", userAuth, async (req, res) => {
  try {
    console.log(req.user)
    const userId = req.user.id;
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        connection: {
          include: {
            users: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    const partner = dbUser?.connection?.users.find((u) => u.id !== userId) ?? null;

    return res.json({
      partner,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});

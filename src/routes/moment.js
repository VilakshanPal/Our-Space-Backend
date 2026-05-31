// TODO: Implement Replies & Reactions
import express from "express";
import fs from "fs";

import { userAuth } from "../middlewares/auth.js";
import { dayBookAuth } from "../middlewares/connection.js";
import {
  createMoment,
  getMoments,
  editMoment,
  deleteMoment,
  createReply,
  getReplies,
  editReply,
  deleteReply,
} from "../services/moment.js";
import { media } from "../middlewares/multer.js";

export const momentRouter = express.Router();

//* CREATE MOMENT
momentRouter.post("/moment/create", userAuth, dayBookAuth, media, async (req, res) => {
  try {
      const { message } = req.body;
      const textMessage = message?.trim();
      const hasMedia = req.file;
      const user = req.user;

      if (!textMessage && !hasMedia) {
        throw new Error("Either text or media is required");
      }

      const moment = await createMoment(
        textMessage,
        req.file?.path || null,
        user.id,
        req.dayBook.id,
      );
      if (!moment) {
        throw new Error("Moment not created");
      }

      if (hasMedia) {
        fs.unlinkSync(req.file?.path);
      }

      return res.status(200).json({
        status: "Success",
        message: "Moments posted",
        details: moment,
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

// * READ MOMENTS
momentRouter.get("/moments/get", userAuth, dayBookAuth, async (req, res) => {
  try {
    const cursor = req.query.cursor ? req.query.cursor : undefined;
    const moments = await getMoments(req.dayBook.id, cursor);

    res.status(200).json({
      status: "Success",
      message: "Moments fetched",
      details: moments,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});

// * UPDATE MOMENTS
momentRouter.patch("/moment/:id/edit",userAuth, dayBookAuth, async (req, res) => {
    try {
      const updatedMoment = await editMoment(
        req.params.id,
        req.user.id,
        req.dayBook.id,
        req.body.textMessage
      );

      return res.status(200).json({
        status: "Success",
        message: "Moment updated",
        details: updatedMoment,
      });
    } catch (err) {
      return res.status(400).json({
        status: "Error",
        details: err.message,
      });
    }
  }
);

//* DELETE MOMENT
momentRouter.delete("/moment/:id", userAuth, dayBookAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedMoment = await deleteMoment(id, userId,req.dayBook.id);
    if (!deletedMoment) {
      throw new Error("Moment not deleted");
    }
    return res.status(200).json({
      status: "Success",
      message: "Moment deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});




//* CREATE REPLY FOR MOMENT
momentRouter.post("/moment/:id/reply",userAuth, dayBookAuth, async (req, res) => {
  try {
    const { replyText } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    const reply = await createReply(replyText, id, userId,req.dayBook.id);
    res.status(200).json({
      status: "Success",
      message: "Reply sent",
      details: reply,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Reply Failed",
      details: err.message,
    });
  }
});

// *READ REPLY FOR MOMENT
momentRouter.get("/moment/:id/replies",userAuth, dayBookAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const cursor = req.query.cursor ? req.query.cursor : undefined;
    const dayBookId = req.dayBook.id

    const replies = await getReplies(id, dayBookId,cursor);
    return res.status(200).json({
      status: "Success",
      message: "Reply fetched",
      details: replies,
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Fetch Replies Failed",
      details: err.message,
    });
  }
});

// * UPDATE REPLY FOR MOMENT
momentRouter.patch(
  "/momentreply/:id/edit",
  userAuth,
  dayBookAuth,
  async (req, res) => {
    try {
      const updatedReply = await editReply(
        req.params.id,
        req.user.id,
        req.body.replyText
      );

      return res.status(200).json({
        status: "Success",
        message: "Reply updated",
        details: updatedReply,
      });
    } catch (err) {
      return res.status(400).json({
        status: "Error",
        details: err.message,
      });
    }
  }
);

// *DELETE REPLY FOR MOMENT
momentRouter.delete("/momentreply/:id/delete",userAuth, dayBookAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedReply = await deleteReply(id, userId);
    if (!deletedReply) {
      throw new Error("reply not deleted");
    }
    return res.status(200).json({
      status: "Success",
      message: "Reply deleted",
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      message: "Request Failed",
      details: err.message,
    });
  }
});

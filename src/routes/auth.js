import express from "express";
import { prisma } from "../config/prisma.ts";
import bcrypt from "bcrypt";

import { signupValidation } from "../utils/formValidation.js";
import { signJWT } from "../utils/jwt.js";

export const authRouter = express.Router();

// --------------------- SIGNUP USER ---------------------
authRouter.post("/signup", async (req, res) => {
  try {
    signupValidation(req);
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      gender,
      profilePicture,
      bio,
    } = req.body;
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS),
    );
    const user = await prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        hashedPassword,
        gender,
        profilePicture: profilePicture || null,
        bio: bio || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        gender: true,
        profilePicture: true,
        bio: true,
      },
    });

    return res.status(201).json({
      status: "Success",
      message: "Account Created Successfully",
      user: user,
    });
  } catch (e) {
    if (e.errors) {
      return res.status(400).json({
        status: "Failed",
        errors: e.errors,
      });
    }

    if (e.code === "P2002") {
      return res.status(400).json({
        status: "Failed",
        message: `${e.meta.target[0]} already exists`,
      });
    }

    return res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
});

// --------------------- LOGIN USER ---------------------
authRouter.post("/login", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    let user;

    if (!password) {
      throw new Error("Password required");
    }
    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } else if (username) {
      user = await prisma.user.findUnique({
        where: { username },
      });
    }

    if (user) {
      const verifyPassword = await bcrypt.compare(
        password,
        user.hashedPassword,
      );
      if (verifyPassword) {
        const JWT = await signJWT({ id: user.id, email: user.email });
        res.cookie("token", JWT, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res
          .status(200)
          .json({ status: "Success", message: "Login Successful" });
      }
    }
    throw new Error("Invalid Credentials");
  } catch (err) {
    res.status(400).json({ status: "Failed", message: err.message });
  }
});

// --------------------- LOGOUT USER ---------------------
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token").status(200).json({
 status:"Success",
 message:"Logout Successful"
})
});

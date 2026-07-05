import express from "express";
import { prisma } from "../config/prisma.ts";
import bcrypt from "bcrypt";

import { signupValidation } from "../utils/formValidation.js";
import { signJWT } from "../utils/jwt.js";
import { userAuth } from "../middlewares/auth.js";

export const authRouter = express.Router();

// --------------------- SIGNUP USER ---------------------
authRouter.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
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
    const { login, password } = req.body;

    if (!login?.trim()) {
      throw new Error("Email or username required");
    }

    if (!password) {
      throw new Error("Password required");
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login.trim().toLowerCase() }, { username: login.trim() }],
      },
    });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const verifyPassword = await bcrypt.compare(password, user.hashedPassword);

    if (!verifyPassword) {
      throw new Error("Invalid Credentials");
    }

    const JWT = await signJWT({
      id: user.id,
      email: user.email,
    });

    res.cookie("token", JWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 72 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      message: "Login Successful",
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
});

// --------------------- LOGOUT USER ---------------------
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token").status(200).json({
    status: "Success",
    message: "Logout Successful",
  });
});


// --------------------- USERNAME AVAILABILITY CHECK ---------------------
authRouter.get("/check-username", async (req, res) => {
  try {
    let user;
    const userName = req.query.username;

    if (userName) {
      user = await prisma.user.findUnique({
        where: {
          username: userName,
        },
        select: {
          id: true,
          username: true,
        },
      });
    }
    if(user){
      return res.status(200).json({
        available: false,
        message: "This username is already taken",
      });
    }
    if(!user){
      return res.status(200).json({
        available: true,
        message: "Username is Available"
      })
    }
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
});



authRouter.get("/user", userAuth, async (req,res) =>{
  let user = req.user
  return res.status(200).json({
    ...user
  })
})


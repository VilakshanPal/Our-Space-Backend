import express from "express";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import http from "http";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { authRouter } from "./routes/auth.js";
import { connectionRouter } from "./routes/connection.js";
import { momentRouter } from "./routes/moment.js";
import { chatRouter } from "./routes/message.js";
import { initializeSocket } from "./sockets/socket.js";
import { rateLimitValidation } from "./utils/rateLimit.js";

const app = express();
const server = http.createServer(app)
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

initializeSocket(server)

// Rate Limit
const usernameCheckLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per IP
  message: {
    status: "Failed",
    message: "Too many username checks. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


// Routes
app.use('/', rateLimitValidation, authRouter)
app.use('/', connectionRouter)
app.use('/', momentRouter)
app.use('/', chatRouter)


app.get("/test", async(req,res)=>{
      const hi = process.env.SALT_ROUNDS + process.env.JWT_SECRET
      res.send(hi)
})

server.listen(5000);

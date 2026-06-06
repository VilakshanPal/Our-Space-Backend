import express from "express";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import http from "http";

import { authRouter } from "./routes/auth.js";
import { connectionRouter } from "./routes/connection.js";
import { momentRouter } from "./routes/moment.js";
import { chatRouter } from "./routes/message.js";

const app = express();
const server = http.createServer(app)
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRouter)
app.use('/', connectionRouter)
app.use('/', momentRouter)
app.use('/', chatRouter)


app.get("/test", async(req,res)=>{
      const hi = process.env.SALT_ROUNDS + process.env.JWT_SECRET
      res.send(hi)
})

server.listen(3000);

import express from "express";
import cookieParser from "cookie-parser";

import { authRouter } from "./routes/auth.js";
import { connectionRouter } from "./routes/connection.js";
import { momentRouter } from "./routes/moment.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', authRouter)
app.use('/', connectionRouter)
app.use('/', momentRouter)


app.get("/test", async(req,res)=>{
      const hi = process.env.SALT_ROUNDS + process.env.JWT_SECRET
      res.send(hi)
})

app.listen(3000);

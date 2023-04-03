import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import connectDB from "./config/db";
import userRouts from "./routes/userRouts";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import chatRouts from "./routes/chatRouts";
import authRouts from "./routes/groupRouts";
import messageRouts from "./routes/messageRouts";
const app: Express = express();
dotenv.config();
connectDB();

app.use(express.json());

app.use("/api/user", userRouts);
app.use("/api/chat", chatRouts);
app.use("/api/group", authRouts);
app.use("/api/message", messageRouts);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server listen to port" + PORT);
});

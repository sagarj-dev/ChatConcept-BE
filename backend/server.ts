import express, { Express } from "express";
import dotenv from "dotenv";

import connectDB from "./config/db";
import userRouts from "./routes/userRouts";
import { errorHandler, notFound } from "./middleware/errorMiddleware";
import chatRouts from "./routes/chatRouts";
import authRouts from "./routes/groupRouts";
import messageRouts from "./routes/messageRouts";
import cors from "cors";
import { Socket } from "socket.io";
import { createSocketServer } from "./socket/io";
import { IUser } from "./type/types";
import makeUserOnline from "./socket/controllers/makeUserOnline";
import makeUserOffline from "./socket/controllers/makeUserOffline";
import ioSendMessage from "./socket/controllers/ioSendMessage";
import ioClearChatCount from "./socket/controllers/ioClearChatCount";
import ioSetCurrentChat from "./socket/controllers/ioSetCurrentChat";
const app: Express = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/user", userRouts);
app.use("/api/chat", chatRouts);
app.use("/api/group", authRouts);
app.use("/api/message", messageRouts);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("Server listen to port" + PORT);
});

const io = createSocketServer(server);

io.sockets.on("connection", async (socket: Socket) => {
  const user = socket.handshake.query;

  //// setUser online
  await makeUserOnline(user._id as string);
  if (user._id) {
    socket.join(user._id);
  }

  socket.on("newMessage", ioSendMessage);

  socket.on("setCurrentChat", (chatId: string) => {
    ioSetCurrentChat(chatId, socket.handshake.query._id as string);
  });

  socket.on("clearReadCount", (chatId: string) => {
    ioClearChatCount(chatId, socket.handshake.query._id as string);
  });
  socket.on("disconnect", async function () {
    await makeUserOffline(user._id as string);
  });
});

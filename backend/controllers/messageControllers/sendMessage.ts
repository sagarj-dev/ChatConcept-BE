import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../models/messageModel";
import { IMessage } from "../../type/types";

const sendMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  const { chatId, sender, content, messageType } = req.body;
  if (!chatId || !sender || !content || !messageType) {
    res.status(400).json({ data: { error: "invalid request payload" } });
    return;
  }

  let newMessage: IMessage = {
    chat: chatId,
    sender,
    content,
    messageType,
    readBy: [],
    starredBy: [],
  };

  let msgs = await Message.create(newMessage);

  res.status(200).json(msgs);
});

export default sendMessage;

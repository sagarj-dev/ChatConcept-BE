import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../models/messageModel";
import { IMessage } from "../../type/types";
import Chat from "../../models/chatModel";

const sendMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
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

    let createdMsg = await Message.create(newMessage);
    // await createdMsg.populate("sender", "-password");
    // let currentChat = await Chat.findById(chatId);
    let chat = await Chat.findById(chatId);
    if (chat) {
      chat.latestMessage = createdMsg._id;
      chat.unreadCount = chat.unreadCount.map((countObj) => {
        if (countObj.user.toString() === sender.toString()) {
          return { user: countObj.user, count: 0 };
        } else {
          return { user: countObj.user, count: countObj.count + 1 };
        }
      });
      await Chat.findByIdAndUpdate(chatId, chat);
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(500);
  }
});

export default sendMessage;

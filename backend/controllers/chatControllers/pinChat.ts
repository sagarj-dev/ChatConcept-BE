import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import Chat from "../../models/chatModel";

const pinChat = expressAsyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.body;

  if (!chatId) {
    res.status(400).json({ data: { error: "invalid request payload" } });
    return;
  }

  let chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(400).json({ data: { error: "Invalid MessageId" } });
    return;
  }
  if (chat && req.user) {
    const userId = req.user?._id;

    if (chat.pinnedBy.includes(userId)) {
      chat.pinnedBy = chat.pinnedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      chat.pinnedBy.push(userId);
    }
    chat = await Chat.findByIdAndUpdate(chatId, chat, { new: true });
    res.status(200).json(chat);
  }
});

export default pinChat;

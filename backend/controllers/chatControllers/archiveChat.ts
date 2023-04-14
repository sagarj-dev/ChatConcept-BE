import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import Chat from "../../models/chatModel";

const archiveChat = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
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

      if (chat.archivedBy.includes(userId)) {
        chat.archivedBy = chat.archivedBy.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        chat.archivedBy.push(userId);
      }
      chat = await Chat.findByIdAndUpdate(chatId, chat, { new: true });
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(400);
  }
});

export default archiveChat;

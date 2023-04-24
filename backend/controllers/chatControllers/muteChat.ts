import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import Chat from "../../models/chatModel";

const muteChat = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { chatId } = req.body;

    if (!chatId) {
      return res
        .status(400)
        .json({ data: { error: "invalid request payload" } });
    }

    let chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(400).json({ data: { error: "Invalid ChatId" } });
    }
    if (chat && req.user) {
      const userId = req.user?._id;

      if (chat.mutedBy.includes(userId)) {
        chat.mutedBy = chat.mutedBy.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        chat.mutedBy.push(userId);
      }
      chat = await Chat.findByIdAndUpdate(chatId, chat, { new: true });
      res.status(200).json(chat);
    }
  }
);

export default muteChat;

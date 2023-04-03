import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";

const changeGroupName = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { chatId, name } = req.body;
      if (!chatId || !name) {
        res.status(400).json({ data: { error: "invalid request payload" } });
        return;
      }

      const chat = await Chat.findById(chatId);

      if (chat) {
        const updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          { chatName: name },
          { new: true }
        );

        res.status(200).json(updatedChat);
      } else {
        res.status(400).json({ data: { error: "Invalid ChatId" } });
      }
    } catch (error) {
      res.status(400).json({ data: { error: "Server Error" } });
    }
  }
);

export default changeGroupName;

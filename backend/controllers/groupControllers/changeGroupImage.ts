import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";

const changeGroupImage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { chatId, avatar } = req.body;
      if (!avatar || !chatId) {
        res.status(400).json({ data: { error: "invalid request payload" } });
        return;
      }

      const chat = await Chat.findById(chatId);

      if (chat) {
        const isAdmin = chat.admin.filter(
          (user) => user.toString() === req.user?._id.toString()
        );

        if (isAdmin.length > 0) {
          const updatedGroup = await Chat.findByIdAndUpdate(
            chatId,
            { avatar },
            { new: true }
          );
          res.status(200).json(updatedGroup);
        } else {
          res.status(403).json({ data: { error: "Not a Group Admin" } });
        }
      } else {
        res.status(400).json({ data: { error: "Invalid ChatId" } });
      }
    } catch (error) {
      res.status(400).json({ data: { error: "Server Error" } });
    }
  }
);

export default changeGroupImage;

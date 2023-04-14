import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";

const changeGroupImage = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { chatId, avatar } = req.body;
      if (!avatar || !chatId) {
        return res
          .status(400)
          .json({ data: { error: "invalid request payload" } });
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
          return res.status(403).json({ data: { error: "Not a Group Admin" } });
        }
      } else {
        return res.status(400).json({ data: { error: "Invalid ChatId" } });
      }
    } catch (error) {
      res.status(400).json({ data: { error: "Server Error" } });
    }
  }
);

export default changeGroupImage;

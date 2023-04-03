import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../models/messageModel";

const getAllMessage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.body;
    if (!chatId) {
      res.send(400).send({ data: { error: "chatId is not Provided" } });
      return;
    }

    await Message.updateMany(
      { chat: chatId },
      {
        $addToSet: { readBy: req.user?._id },
      }
    );

    let msgs = await Message.find({ chat: chatId });
    res.status(200).json(msgs);
  }
);

export default getAllMessage;

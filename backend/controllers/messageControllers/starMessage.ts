import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../models/messageModel";
import { IMessage } from "../../type/types";

const starMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  const { messageId } = req.body;

  if (!messageId) {
    res.status(400).json({ data: { error: "invalid request payload" } });
    return;
  }

  let msg = await Message.findById(messageId);
  if (!msg) {
    res.status(400).json({ data: { error: "Invalid MessageId" } });
    return;
  }
  if (msg && req.user) {
    const userId = req.user?._id;

    if (msg.starredBy.includes(userId)) {
      msg.starredBy = msg.starredBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      msg.starredBy.push(userId);
    }
    msg = await Message.findByIdAndUpdate(messageId, msg, { new: true });
    res.status(200).json(msg);
  }
});

export default starMessage;

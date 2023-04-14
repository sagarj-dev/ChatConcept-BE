import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";

const getAllPinnedChat = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    if (req.user) {
      let msgs = await Chat.find({ pinnedBy: req.user._id });
      return res.status(200).json(msgs);
    } else {
      res.status(200).json({ error: "error" });
    }
  }
);

export default getAllPinnedChat;

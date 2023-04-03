import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";

const getAllArchivedChat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (req.user) {
      let msgs = await Chat.find({ archivedBy: req.user._id });
      res.status(200).json(msgs);
    } else {
      res.status(200).json({ error: "error" });
    }
  }
);

export default getAllArchivedChat;

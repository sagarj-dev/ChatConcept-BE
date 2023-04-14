import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";

const getAllArchivedChat = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (req.user) {
        let msgs = await Chat.find({ archivedBy: req.user._id });
        return res.status(200).json(msgs);
      } else {
        res.status(200).json({ error: "error" });
      }
    } catch (error) {
      res.status(400);
    }
  }
);

export default getAllArchivedChat;

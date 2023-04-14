import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../models/messageModel";

const getAllStarredMessage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        let msgs = await Message.find({ starredBy: req.user._id });
        res.status(200).json(msgs);
      } else {
        res.status(200).json({ error: "error" });
      }
    } catch (error) {
      res.status(500);
    }
  }
);

export default getAllStarredMessage;

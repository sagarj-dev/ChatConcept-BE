import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../models/messageModel";

const getAllStarredMessage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.user);

    if (req.user) {
      let msgs = await Message.find({ starredBy: req.user._id });
      res.status(200).json(msgs);
    } else {
      res.status(200).json({ error: "error" });
    }
  }
);

export default getAllStarredMessage;

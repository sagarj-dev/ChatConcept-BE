import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";
import { chatPopulateQuery } from "../../utils/populateQueries";

const getAllChats = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    Chat.find({
      users: {
        $elemMatch: { $eq: req.user?._id },
      },
    })
      .populate(chatPopulateQuery)
      .then((results) => {
        res.status(200).json(results);
      });
  } catch (error) {
    res.status(500).json({
      data: {
        error: "Internal Error",
      },
    });
  }
});

export default getAllChats;

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";

const getAllChats = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const populateQuery = [
      {
        path: "users",
        select: "-password",
      },
      {
        path: "admin",
        select: "-password",
      },
      {
        path: "mutedBy",
        select: "-password",
      },
      {
        path: "archivedBy",
        select: "-password",
      },
      {
        path: "pinnedBy",
        select: "-password",
      },
      {
        path: "letestMessage",
      },
    ];
    Chat.find({
      users: {
        $elemMatch: { $eq: req.user?._id },
      },
    })
      .populate(populateQuery)
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

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import Chat from "../../models/chatModel";

const leaveGroup = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { chatId } = req.body;
    if (!chatId) {
      res.status(400).json({ data: { error: "invalid request payload" } });
      return;
    }

    let group = await Chat.findById(chatId);

    if (!group) {
      res.status(400).json({ data: { error: "invalid ChatId" } });
      return;
    }

    if (group) {
      let newUsers = group.users.filter(
        (user) => user.toString() !== req.user?._id.toString()
      );
      let newAdmins = group.admin.filter(
        (user) => user.toString() !== req.user?._id.toString()
      );
      if (newUsers.length === 0) {
        Chat.findByIdAndDelete(chatId).then(() => {
          res.status(200).json({ data: "Group Left Successfully" });
        });
      }
      await Chat.findByIdAndUpdate(
        chatId,
        {
          users: newUsers,
          admin: newAdmins,
        },
        { new: true }
      );
      res.status(200).json({ data: "Group Left Successfully" });
    }
  } catch (error) {
    res.status(400);
  }
});

export default leaveGroup;

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";
import checkArrayIdIsValid from "../../utility/checkArrayIdIsValid";

interface IRequestBody {
  chatId: string;
  members: string[];
}

const removeGroupMember = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { chatId, members }: IRequestBody = req.body;

      if (!chatId || members.length === 0) {
        res.status(400).json({ data: { error: "invalid request payload" } });
        return;
      }

      if (!checkArrayIdIsValid(members)) {
        res.status(400).json({ data: { error: "invalid Users" } });
        return;
      }

      if (req.user && members.includes(req.user._id.toString())) {
        res.status(400).json({ data: { error: "Cant remove CUrrent User" } });
        return;
      }

      const group = await Chat.findById(chatId);

      if (group) {
        if (
          group.admin.filter(
            (user) => user.toString() === req.user?._id.toString()
          ).length === 0
        ) {
          res.status(403).json({ data: { error: "User is not group Admin" } });
          return;
        }

        let newUsers = group.users.filter(
          (user) => !members.includes(user.toString())
        );
        let newAdmins = group.admin.filter(
          (user) => !members.includes(user.toString())
        );

        const updatedGroup = await Chat.findByIdAndUpdate(
          chatId,
          {
            users: newUsers,
            admin: newAdmins,
          },
          { new: true }
        );
        res.status(200).json(updatedGroup);
      } else {
        res.status(400).json({ data: { error: "invalid chatId" } });
      }
    } catch (error) {
      res.status(400);
    }
  }
);

export default removeGroupMember;

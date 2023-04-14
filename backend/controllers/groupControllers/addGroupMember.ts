import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";
import checkArrayIdIsValid from "../../utility/checkArrayIdIsValid";

interface IRequestBody {
  chatId: string;
  members: string[];
}

const addGroupMember = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { chatId, members }: IRequestBody = req.body;

      if (!chatId || members.length === 0) {
        return res
          .status(400)
          .json({ data: { error: "invalid request payload" } });
      }

      if (!checkArrayIdIsValid(members)) {
        return res.status(400).json({ data: { error: "invalid Users" } });
      }

      const group = await Chat.findById(chatId);

      if (group) {
        if (
          group.admin.filter(
            (user) => user.toString() === req.user?._id.toString()
          ).length === 0
        ) {
          return res
            .status(403)
            .json({ data: { error: "User is not group Admin" } });
        }

        let newUsers = [
          ...group.users.filter((user) => !members.includes(user.toString())),
          ...members,
        ];

        const updatedGroup = await Chat.findByIdAndUpdate(
          chatId,
          {
            users: newUsers,
          },
          { new: true }
        );
        res.status(200).json(updatedGroup);
      } else {
        return res.status(400).json({ data: { error: "invalid chatId" } });
      }
    } catch (error) {
      res.status(500);
    }
  }
);

export default addGroupMember;

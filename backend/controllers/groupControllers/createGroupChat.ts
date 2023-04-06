import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { defaultWallpaper } from "../../constant/constant";
import Chat from "../../models/chatModel";
import { IChat } from "../../type/types";
import { Types } from "mongoose";

const createGroupChat = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const { name, users, avatar } = req.body;
        if (!name || users.length === 0) {
          res.status(400).json({ data: { error: "invalid request payload" } });
          return;
        }

        const groupChatData: IChat = {
          chatName: name,
          isGroupChat: true,
          users: users,
          admin: [req.user._id],
          mutedBy: [],
          unreadCount: users.map((user: Types.ObjectId) => ({
            user,
            count: 0,
          })),
          archivedBy: [],
          pinnedBy: [],
          isblocked: false,
          wallpaper: defaultWallpaper,
        };

        if (avatar) groupChatData.avatar = avatar;
        Chat.create(groupChatData).then((newGroup) => {
          res.json(newGroup);
        });
      }
    } catch (error) {
      res.status(400);
    }
  }
);

export default createGroupChat;

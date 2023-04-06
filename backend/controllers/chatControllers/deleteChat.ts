import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/chatModel";

const deleteChat = expressAsyncHandler(async (req: Request, res: Response) => {
  let id: string = req.body.chatId;
  if (!id) {
    res.status(400).json({ data: { error: "ChatId not provided" } });
    return;
  }
  try {
    const chat = await Chat.findById(id);

    if (!chat) res.status(400).json({ data: { error: "Invalid chat" } });

    if (chat) {
      if (!chat.isGroupChat) {
        Chat.findByIdAndDelete().then(() => {
          res.status(200).json({ data: "deleted chat successfully" });
        });
      } else {
        // its a group chat
        if (chat.users.length === 1) {
          // group has only one member so delete the group
          Chat.findByIdAndDelete().then(() => {
            res.status(200).json({ data: "deleted chat successfully" });
          });
        } else {
          // its a group chat so remove user from users and admins array
          chat.users = chat?.users.filter(
            (user) => user.toString() !== req.user?._id.toString()
          );
          chat.admin = chat?.admin.filter(
            (user) => user.toString() !== req.user?._id.toString()
          );
          chat.save();

          res.status(200).json({ data: "deleted chat successfully" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      data: {
        error: "Invalid chat Id",
      },
    });
  }
});

export default deleteChat;

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../models/messageModel";
import { io } from "../../socket/io";
import Chat from "../../models/chatModel";
import { chatPopulateQuery } from "../../utils/populateQueries";

const getAllMessage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { chatId } = req.params;

      if (!chatId) {
        res.status(400).json({ data: { error: "chatId is not Provided" } });
        return;
      }

      await Message.updateMany(
        { chat: chatId },
        {
          $addToSet: { readBy: req.user?._id },
          messageStatus: "delivered",
        }
      );
      // await Message.find(
      //   { chat: chatId },
      //   { messageStatus: "delivered" },
      //   { multi: true, new: true }
      // );

      let msgs = await Message.find({ chat: chatId });
      if (req.user) {
        let chat = await Chat.findById(chatId);
        if (chat) {
          chat.unreadCount = chat.unreadCount.map((countObj) => {
            if (countObj.user.toString() === req.user?._id.toString()) {
              return { user: countObj.user, count: 0 };
            } else {
              return countObj;
            }
          });
          chat = await Chat.findByIdAndUpdate(chatId, chat, {
            new: true,
          }).populate(chatPopulateQuery);
        }
        io?.sockets.in(req.user._id.toString()).emit("updateChat", chat);
      }
      res.status(200).json(msgs);
    } catch (error) {
      res.status(500);
    }
  }
);

export default getAllMessage;

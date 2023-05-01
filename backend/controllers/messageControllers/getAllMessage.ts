import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../models/messageModel";
import { io } from "../../socket/io";
import Chat from "../../models/chatModel";
import { chatPopulateQuery } from "../../utils/populateQueries";
import { IMessage } from "../../type/types";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isBetween from "dayjs/plugin/isBetween";
import localeData from "dayjs/plugin/localeData";
import User from "../../models/userModel";
dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
interface Iparams {
  chatId: string;
  page: number;
}
const getAllMessage = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      let { chatId, page } = req.params;
      let perPage = 1;

      if (!chatId) {
        res.status(400).json({ data: { error: "Invalid Query" } });
        return;
      }

      // let temp = +page;

      // if (Number.isNaN(temp) || temp < 1) {
      //   res.status(400).json({ data: { error: "Invalid Query" } });
      //   return;
      // }

      await Message.updateMany(
        { chat: chatId },
        {
          $addToSet: { readBy: req.user?._id },
        }
      );
      await Message.updateMany(
        { chat: chatId, sender: { $ne: req.user?._id } },
        {
          messageStatus: "read",
        }
      );

      let msgs = await Message.find({ chat: chatId });
      // .limit(perPage)
      // .skip(parseInt(page) - 1 * perPage);

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

      let pilledMsg = msgs.map((m) => {
        if (dayjs(m.createdAt).isToday()) {
          return { ...m.toJSON(), dateTag: "Today" };
        } else if (dayjs(m.createdAt).isYesterday()) {
          return { ...m.toJSON(), dateTag: "Yesterday" };
        } else if (
          dayjs(m.createdAt).isBetween(
            dayjs().subtract(2, "D"),
            dayjs().subtract(6, "D")
          )
        ) {
          return {
            ...m.toJSON(),
            dateTag: dayjs(m.createdAt).localeData().weekdays()[dayjs().day()],
          };
        } else {
          return {
            ...m.toJSON(),
            dateTag: dayjs(m.createdAt).format("DD/MM/YYYY"),
          };
        }
      });
      await User.findByIdAndUpdate(req.user?._id, { currentChat: chatId });
      res.status(200).json(pilledMsg);
    } catch (error) {
      res.status(500);
    }
  }
);

export default getAllMessage;

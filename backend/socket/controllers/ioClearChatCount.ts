import { Types } from "mongoose";

import { io } from "../io";
import Chat from "../../models/chatModel";
import { chatPopulateQuery } from "../../utils/populateQueries";
interface IChatMsg {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  messageType: "text" | "pdf" | "image" | "video" | "Doc" | "Audio";
}
const ioClearChatCount = async (chatId: string, userId: string) => {
  try {
    let chat = await Chat.findById(chatId);
    if (chat) {
      chat.unreadCount = chat.unreadCount.map((countObj) => {
        if (countObj.user.toString() === userId.toString()) {
          return { user: countObj.user, count: 0 };
        } else {
          return countObj;
        }
      });
      chat = await Chat.findByIdAndUpdate(chatId, chat, { new: true }).populate(
        chatPopulateQuery
      );
    }
    if (chat) {
      chat.users.forEach((user) => {
        io?.sockets.in(user._id.toString()).emit("updateChat", chat);
      });
    }
  } catch (error) {}
};

export default ioClearChatCount;

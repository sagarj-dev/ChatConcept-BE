import { Types } from "mongoose";
import Message from "../../models/messageModel";
import { IMessage } from "../../type/types";
import { io } from "../io";
import Chat from "../../models/chatModel";
import { chatPopulateQuery } from "../../utils/populateQueries";
import User from "../../models/userModel";
interface IChatMsg {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  messageType: "text" | "pdf" | "image" | "video" | "Doc" | "Audio";
}
const ioSendMessage = async ({
  chatId,
  sender,
  content,
  messageType,
}: IChatMsg) => {
  let newMessage: IMessage = {
    chat: chatId,
    sender,
    content,
    messageType,
    readBy: [],
    starredBy: [],
  };
  let createdMsg = await Message.create(newMessage);

  let chat = await Chat.findById(chatId);
  if (chat) {
    let activeChats = (
      await User.find({ currentChat: chatId }).select("id")
    ).map((a) => a._id.toString());

    chat.latestMessage = createdMsg._id;
    chat.unreadCount = chat.unreadCount.map((countObj) => {
      if (activeChats.includes(countObj.user.toString())) {
        return { user: countObj.user, count: 0 };
      } else {
        return { user: countObj.user, count: countObj.count + 1 };
      }
    });
    chat = await Chat.findByIdAndUpdate(chatId, chat, { new: true }).populate(
      chatPopulateQuery
    );
  }
  if (chat) {
    chat.users.forEach((user) => {
      io?.sockets.in(user._id.toString()).emit("newMessage", chat);
    });
  }
};

export default ioSendMessage;

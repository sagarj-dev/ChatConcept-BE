import { Types } from "mongoose";
import Message from "../../models/messageModel";

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
  console.log("got message");

  try {
    let newMessage = {
      chat: chatId,
      sender,
      content,
      messageType,
      messageStatus: "sent",
      readBy: [],
      starredBy: [],
    };

    let chat = await Chat.findById(chatId);
    if (chat) {
      if (chat.isGroupChat === false) {
        const receiverID = chat?.users.filter(
          (u) => u._id.toString() !== sender.toString()
        )[0];

        let receiver = await User.findById(receiverID);

        if (receiver?.onlineStatus === "Online") {
          newMessage.messageStatus = "delivered";
        }
        if (receiver?.currentChat?.toString() === chatId.toString()) {
          newMessage.messageStatus = "read";
        }
      }
      let activeChats = (
        await User.find({ currentChat: chatId }).select("id")
      ).map((a) => a._id.toString());

      let createdMsg = await Message.create(newMessage);

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
  } catch (error) {
    console.log("ioSendMessage eroor", error);
  }
};

export default ioSendMessage;

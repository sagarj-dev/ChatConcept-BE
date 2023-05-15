import Chat from "../../models/chatModel";
import Message from "../../models/messageModel";
import User from "../../models/userModel";
import { io } from "../io";
const makeUserOnline = async (id: string) => {
  try {
    const userChats = await Chat.find({ users: id }, "_id");
    const chatIDs = userChats.map((c) => c._id.toString());
    const unreadChat = await Message.find(
      {
        chat: { $in: chatIDs },
        sender: { $ne: id },
        messageStatus: { $eq: "sent" },
      },
      "chat -_id",
      { lean: true }
    );
    // console.log(unreadChat);
    let unreadChatUnique: string[] = [];
    unreadChat.forEach((unreadChatId) => {
      if (!unreadChatUnique.includes(unreadChatId.chat.toString())) {
        return unreadChatUnique.push(unreadChatId.chat.toString());
      }
    });

    await Message.updateMany(
      { chat: { $in: chatIDs }, sender: { $ne: id } },
      { messageStatus: "delivered" },
      { multi: true, new: true }
    );

    const user = await User.findByIdAndUpdate(
      id,
      { onlineStatus: "Online" },
      { new: true }
    );

    io?.sockets.emit("userStatusChanged", user);

    unreadChatUnique.forEach(async (unreadChatId) => {
      const chat = await Chat.findOne({ _id: unreadChatId });
      if (chat && !chat.isGroupChat) {
        chat.users.forEach((userId) => {
          if (userId.toString() !== id) {
            io?.sockets.in(userId.toString()).emit("updateChat", chat);
            io?.sockets.in(userId.toString()).emit("messageStatusChanged", {
              chatId: chat._id.toString(),
              status: "delivered",
            });
          }
        });
      }
    });
  } catch (error) {
    console.log("MakeUserOnline", error);
  }
};

export default makeUserOnline;

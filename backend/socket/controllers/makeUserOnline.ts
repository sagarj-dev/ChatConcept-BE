import Chat from "../../models/chatModel";
import Message from "../../models/messageModel";
import User from "../../models/userModel";
import { io } from "../io";
const makeUserOnline = async (id: string) => {
  try {
    const userChats = await Chat.find({ users: id }, "_id");
    const chatIDs = userChats.map((c) => c._id.toString());
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
  } catch (error) {
    console.log("MakeUserOnline", error);
  }
};

export default makeUserOnline;

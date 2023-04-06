import User from "../../models/userModel";

const ioSetCurrentChat = async (chatId: string, userId: string) => {
  let a = await User.findByIdAndUpdate(
    userId,
    { currentChat: chatId },
    { new: true }
  );
};

export default ioSetCurrentChat;

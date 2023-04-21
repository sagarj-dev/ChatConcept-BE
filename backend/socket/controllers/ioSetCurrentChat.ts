import User from "../../models/userModel";

const ioSetCurrentChat = async (chatId: string, userId: string) => {
  try {
    let a = await User.findByIdAndUpdate(
      userId,
      { currentChat: chatId },
      { new: true }
    );
  } catch (error) {}
};

export default ioSetCurrentChat;

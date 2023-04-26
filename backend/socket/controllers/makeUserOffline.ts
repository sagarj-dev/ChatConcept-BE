import User from "../../models/userModel";
import { io } from "../io";
const makeUserOffline = async (id: string) => {
  try {
    const date = new Date();
    const user = await User.findByIdAndUpdate(
      id,
      {
        onlineStatus: date.toISOString(),
        currentChat: null,
      },
      { new: true }
    );

    io?.sockets.emit("UserStatusChanged", user);
  } catch (error) {
    console.log("makeUserOffline error", error);
  }
};

export default makeUserOffline;

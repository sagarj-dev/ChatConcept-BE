import User from "../../models/userModel";
import { io } from "../io";
const makeUserOnline = async (id: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { onlineStatus: "Online" },
      { new: true }
    );
    io?.sockets.emit("UserStatusChanged", user);
  } catch (error) {
    console.log("MakeUserOnline", error);
  }
};

export default makeUserOnline;

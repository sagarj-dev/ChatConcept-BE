import User from "../../models/userModel";

const makeUserOnline = async (id: string) => {
  await User.findByIdAndUpdate(id, { onlineStatus: "Online" }, { new: true });
};

export default makeUserOnline;

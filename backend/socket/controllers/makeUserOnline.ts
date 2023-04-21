import User from "../../models/userModel";

const makeUserOnline = async (id: string) => {
  try {
    await User.findByIdAndUpdate(id, { onlineStatus: "Online" }, { new: true });
  } catch (error) {
    console.log("MakeUserOnline", error);
  }
};

export default makeUserOnline;

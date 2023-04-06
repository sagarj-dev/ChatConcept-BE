import User from "../../models/userModel";

const makeUserOffline = async (id: string) => {
  const date = new Date();
  await User.findByIdAndUpdate(id, {
    onlineStatus: date.toISOString(),
    currentChat: null,
  });
};

export default makeUserOffline;

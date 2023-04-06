import { Model, model, Schema } from "mongoose";
import { IChat, IUser, IUserMethods } from "../type/types";
import bcrypt from "bcryptjs";
import Chat from "./chatModel";

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    onlineStatus: { type: String, default: new Date().toISOString() },
    statusMessage: { type: String, default: "" },
    currentChat: { type: Schema.Types.ObjectId, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.post("save", async function (addedUser) {
  User.find({ _id: { $ne: addedUser._id } }).then(function (users) {
    users.forEach(async (dbUser) => {
      let chatData: IChat = {
        admin: [],
        chatName: "single",
        archivedBy: [],
        isblocked: false,
        isGroupChat: false,
        mutedBy: [],
        pinnedBy: [],
        unreadCount: [
          {
            user: dbUser._id,
            count: 0,
          },
          {
            user: addedUser._id,
            count: 0,
          },
        ],
        users: [dbUser._id, addedUser._id],
        wallpaper: "#77777",
      };
      await Chat.create(chatData);
    });
  });
});

userSchema.methods.checkPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;

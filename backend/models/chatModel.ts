import { model, Schema } from "mongoose";
import { defaultAvatar } from "../constant/constant";
import { IChat } from "../type/types";

const chatModel = new Schema<IChat>({
  chatName: { type: String, trim: true },
  isGroupChat: { type: Boolean, default: false },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  letestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  admin: [{ type: Schema.Types.ObjectId, ref: "User" }],
  mutedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  unreadCount: { type: Number, default: 0 },
  isblocked: { type: Boolean, default: false },
  wallpaper: { type: String, default: "#777777" },
  archivedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  pinnedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  avatar: {
    type: String,
    default: defaultAvatar,
  },
});

const Chat = model<IChat>("Chat", chatModel);

export default Chat;

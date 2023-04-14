import { model, Schema } from "mongoose";
import { defaultAvatar } from "../constant/constant";
import { IChat } from "../type/types";

const chatModel = new Schema<IChat>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    admin: [{ type: Schema.Types.ObjectId, ref: "User" }],
    mutedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    unreadCount: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: false },
      },
    ],
    isblocked: { type: Boolean, default: false },
    wallpaper: { type: String, default: "#777777" },
    archivedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    pinnedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model<IChat>("Chat", chatModel);

export default Chat;

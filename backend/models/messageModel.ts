import { Model, Schema, model } from "mongoose";
import { IMessage } from "../type/types";

type UserModel = Model<IMessage, {}, {}>;

const messageModel = new Schema<IMessage, UserModel, {}>(
  {
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    messageStatus: { type: String, default: "sent" },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    starredBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messageType: {
      type: String,
      trim: true,
      enum: ["text", "pdf", "image", "gif", "video", "doc", "audio", "link"],
    },
  },
  {
    timestamps: true,
  }
);

const Message = model<IMessage, UserModel>("Message", messageModel);

export default Message;

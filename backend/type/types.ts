import { Document, Types } from "mongoose";
export interface IUser {
  name: string;
  password: string;
  email: string;
  avatar: string;
  onlineStatus: string;
  statusMessage: string;
  currentChat: Types.ObjectId | null;
}

export interface IMessage {
  readBy: Types.ObjectId[];
  sender: Types.ObjectId;
  content: string;
  messageStatus: "sent" | "delivered" | "read";
  chat: Types.ObjectId;
  starredBy: Types.ObjectId[];
  messageType: "text" | "pdf" | "image" | "video" | "doc" | "audio" | "link";
  createdAt: string;
  updatedAt: string;
  dateTage?: string;
}

export interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  admin: Types.ObjectId[];
  mutedBy: Types.ObjectId[];
  unreadCount: { user: Types.ObjectId; count: number }[];
  isblocked: boolean;
  wallpaper: string;
  archivedBy: Types.ObjectId[];
  pinnedBy: Types.ObjectId[];
  latestMessage?: Types.ObjectId;
  avatar?: string;
}

export interface IUserMethods {
  checkPassword: (password: string) => Promise<boolean>;
}

declare module "express-serve-static-core" {
  export interface Request {
    user: ({ _id: Types.ObjectId } & IUser) | null;
  }
}

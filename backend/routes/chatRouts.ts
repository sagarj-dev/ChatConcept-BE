import express from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import deleteChat from "../controllers/chatControllers/deleteChat";

import getAllChats from "../controllers/chatControllers/getAllChats";
import pinChat from "../controllers/chatControllers/PinChat";
import getAllPinnedChat from "../controllers/chatControllers/getAllpinnedChat";
import getAllArchivedChat from "../controllers/chatControllers/getAllArchivedChat";
import archiveChat from "../controllers/chatControllers/archiveChat";

const chatRouts = express.Router();

chatRouts.use(authMiddleware);

chatRouts.get("/", getAllChats); // get all the chats

chatRouts.delete("/", deleteChat); // get all the chats

chatRouts.get("/pin", getAllPinnedChat); // get all the chats

chatRouts.post("/pin", pinChat); // get all the chats

chatRouts.get("/archive", getAllArchivedChat); // get all the chats

chatRouts.post("/archive", archiveChat); // get all the chats

export default chatRouts;

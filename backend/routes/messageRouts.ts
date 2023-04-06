import express from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import getAllMessage from "../controllers/messageControllers/getAllMessage";
import sendMessage from "../controllers/messageControllers/sendMessage";
import starMessage from "../controllers/messageControllers/starMessage";
import getAllStarredMessage from "../controllers/messageControllers/getAllStarredMessage";

const messageRouts = express.Router();

messageRouts.use(authMiddleware);

messageRouts.get("/:chatId", getAllMessage); // get all the messages

messageRouts.post("/", sendMessage); // get all the messages

messageRouts.get("/star", getAllStarredMessage); // get all the starred messages

messageRouts.post("/star", starMessage); // get all the messages

export default messageRouts;

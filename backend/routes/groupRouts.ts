import express from "express";
import addGroupMember from "../controllers/groupControllers/addGroupMember";
import changeGroupImage from "../controllers/groupControllers/changeGroupImage";
import changeGroupName from "../controllers/groupControllers/changeGroupName";
import createGroupChat from "../controllers/groupControllers/createGroupChat";
import leaveGroup from "../controllers/groupControllers/leaveGroup";
import removeGroupImage from "../controllers/groupControllers/removeGroupImage";
import removeGroupMember from "../controllers/groupControllers/removeGroupMember";

import { authMiddleware } from "../middleware/authMiddleware";

const groupRouts = express.Router();

groupRouts.use(authMiddleware);

groupRouts.post("/create", createGroupChat); // create group chat

groupRouts.post("/photo", changeGroupImage); // change group photo

groupRouts.delete("/photo", removeGroupImage); // DELETE group photo

groupRouts.post("/name", changeGroupName); // change group name

groupRouts.post("/member", addGroupMember); // add member from group chat

groupRouts.delete("/member", removeGroupMember); // remove member from group chat

groupRouts.delete("/leave", leaveGroup); // leave group chat

export default groupRouts;

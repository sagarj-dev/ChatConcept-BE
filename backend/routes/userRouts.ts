import express from "express";

import { authMiddleware } from "../middleware/authMiddleware";
import getAllUsers from "../controllers/userControllers/getAllUsers";
import registerUser from "../controllers/userControllers/registerUser";
import loginUser from "../controllers/userControllers/loginUser";
import editUserProfile from "../controllers/userControllers/editUserProfile";

const userRouts = express.Router();

userRouts.post("/login", loginUser);

userRouts.get("/", authMiddleware, getAllUsers);

userRouts.post("/register", registerUser);

userRouts.post("/edit", authMiddleware, editUserProfile);

export default userRouts;

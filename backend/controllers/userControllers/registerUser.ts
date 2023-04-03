import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import generateToken from "../../config/generateToken";
import User from "../../models/userModel";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please enter all required fields");
  }

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    res.status(400);
    throw new Error("User already Exists");
  }
  const user = await User.create({ name, email, password, avatar });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400);
    throw new Error("Flied to create a new user");
  }
});

export default registerUser;

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import generateToken from "../../config/generateToken";
import User from "../../models/userModel";

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(401).json({ error: "Invalid Email" });
  } else if (user && (await user.checkPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401).json({ error: "Invalid Password" });
  }
});

export default loginUser;

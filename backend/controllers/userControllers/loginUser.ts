import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import generateToken from "../../config/generateToken";
import User from "../../models/userModel";

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let errors = { email: "", password: "" };
    const user = await User.findOne({ email: email });
    if (!user) {
      errors.email = "Invalid Email";
      res.status(401).json({ error: errors });
    } else if (user && (await user.checkPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id.toString()),
      });
    } else {
      errors.password = "Invalid Password";
      res.status(401).json({ error: errors });
    }
  } catch (error) {
    res.status(500);
  }
});

export default loginUser;

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import generateToken from "../../config/generateToken";
import User from "../../models/userModel";
interface IBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  let { name, email, password, avatar }: IBody = req.body;

  if (!name || !email || !password) {
    res
      .status(400)
      .json({ data: { error: "please enter all required fields" } });
    throw new Error("please enter all required fields");
  }

  email = email.toLowerCase();
  if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    res.status(400).json({ data: { error: "invalid Email" } });
    throw new Error("Invalid email");
  }

  // (?=(.*[a-z]){3,})               lowercase letters. {3,} indicates that you want 3 of this group
  // (?=(.*[A-Z]){2,})               uppercase letters. {2,} indicates that you want 2 of this group
  // (?=(.*[0-9]){2,})               numbers. {2,} indicates that you want 2 of this group
  // (?=(.*[!@#$%^&*()\-__+.]){1,})  all the special characters in the [] fields. The ones used by regex are escaped by using the \ or the character itself. {1,} is redundant, but good practice, in case you change that to more than 1 in the future. Also keeps all the groups consistent
  // {8,}                            indicates that you want 8 or more
  // $            end anchor
  if (
    !password.match(
      /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()]){1,}).{8,}$/
    )
  ) {
    res.status(400).json({ data: { error: "Please Use a strong password" } });
    throw new Error("invalid password");
  }

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    res.status(400).json({ data: { error: "User already exist" } });
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

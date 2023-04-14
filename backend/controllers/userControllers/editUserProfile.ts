import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../../models/userModel";
import { defaultAvatar } from "../../constant/constant";

const editUserProfile = asyncHandler(async (req: Request, res: Response) => {
  try {
    let { name, avatar, statusMessage } = req.body;
    let body = { name, avatar, statusMessage };
    if (avatar.length < 10) {
      body.avatar = defaultAvatar;
    }
    const updatedUser = await User.findByIdAndUpdate(req.user?._id, body, {
      new: true,
    });

    res.send(updatedUser);
  } catch (error) {
    res.status(500);
  }
});

export default editUserProfile;

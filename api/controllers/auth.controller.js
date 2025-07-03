import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//USE OF MIDDLEWARE
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("new user crated successfully");
  } catch (e) {
    next(e);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not found!"));
    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    //we dont to respond back the password even if its hashed ~ its a good practice
    //password ko userInfo se alag kar de rhe or baaki sab ko restUserInfo pe store kar de rhe hai
    const { password: pass, ...restUserInfo } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true }) //expires:new Date(Date.now())})
      .status(200)
      .json(restUserInfo);
  } catch (err) {
    next(err);
  }
};

import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("new user crated successfully");
  } catch (e) {
    res.status(500).json(e.message);
  }
};

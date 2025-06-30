import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use("/api/user", userRouter); //review these few api usage
app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});

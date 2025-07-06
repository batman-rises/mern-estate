import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadRouter from "./routes/upload.route.js";

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
app.use("/api/upload", uploadRouter); //cloudinary route

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});

//ERROR handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(3000, () => {
  console.log("app is listening on port 3000");
});

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import { UserCtrl } from "./controllers/UserController.js";
import { registerValidations } from "./validations/register.js";
import { passport } from "./core/passport.js";
import { TweetsCtrl } from "./controllers/TweetsController.js";
import { createTweetsValidations } from "./validations/createTweet.js";
import cors from "cors";
import checkAuth from "./utils/checkAuth.js";
import multer from "multer";
import { UploadCtrl } from "./controllers/UploadFilesController.js";

const app = express();

app.use(cors());

app.use(express.json());

// const storage = multer.diskStorage({
//   destination: function (_, __, cb) {
//     cb(null, __dirname + "/uploads");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.originalname.split(".").pop();
//     const uniqueSuffix = "image=" + Date.now() + "." + ext;
//     cb(null, uniqueSuffix);
//   },
// });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(passport.initialize());

app.get(
  "/users/me",
  // passport.authenticate("jwt", { session: false }),
  checkAuth,
  UserCtrl.getUserInfo
);
app.get("/users", UserCtrl.index);
app.post("/auth/register", registerValidations, UserCtrl.create);
app.get("/auth/verify", registerValidations, UserCtrl.verify);
app.get("/users/:id", UserCtrl.show);

app.post(
  "/auth/login",
  passport.authenticate("local", {
    session: false,
  }),
  UserCtrl.afterLogin
);

app.get("/tweets", TweetsCtrl.index);
app.get("/tweet/:id", TweetsCtrl.show);
app.get("/users/tweets/:id", TweetsCtrl.getUserTweets);
app.post(
  "/tweet",
  // passport.authenticate("jwt"),
  checkAuth,
  createTweetsValidations,
  TweetsCtrl.create
);
app.delete(
  "/tweet/:id",
  // passport.authenticate("jwt"),
  checkAuth,
  createTweetsValidations,
  TweetsCtrl.delete
);
app.patch(
  "/tweet/:id",
  // passport.authenticate("jwt"),
  checkAuth,
  createTweetsValidations,
  TweetsCtrl.update
);

app.post("/upload", upload.single("image"), UploadCtrl.upload);

app.listen(8888, () => {
  mongoose.connect(process.env.MONGO_DB);
  console.log("Server Run");
});
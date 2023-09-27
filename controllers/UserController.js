import { body, validationResult } from "express-validator";
import { UserModel } from "../models/UserModel.js";
import { generateMD5 } from "../utils/generateHash.js";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const isValidObjectId = mongoose.Types.ObjectId.isValid;

class UserController {
  async index(req, res) {
    try {
      const users = await UserModel.find({}).exec();

      res.json({
        status: "success",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        statos: "error",
        message: JSON.stringify(error),
      });
    }
  }

  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ status: "error", errors: errors.array() });
      }
      const data = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        password: generateMD5(req.body.password + process.env.SECRET_KEY),
        confirm_hash: generateMD5(
          process.env.SECRET_KEY + Math.random().toString()
        ),
      };

      sendEmail({
        emailFrom: "toporkov.frontenddev@gmail.com",
        emailTo: data.email,
        subject: "Подтверждение почты Twitter Clone React",
        html: `Для того, чтобы подтвердить почту, перейдите <a href='${
          process.env.REACT_APP_API_URL || "http://localhost:8888"
        }auth/verify?hash=${data.confirm_hash}'>по этой ссылке</a>`,
      });

      const user = await UserModel.create(data);

      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      res.json({
        message: "Не удалось зареегстрироваться",
        error: error,
      });
      console.log(error);
    }
  }

  async verify(req, res) {
    try {
      const hash = req.query.hash;
      console.log(hash);
      if (!hash) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findOne({ confirm_hash: hash }).exec();
      console.log(user);

      if (user) {
        user.confirmed = true;
        user.save();

        res.send("Ваш аккаунт подтверждён! Можете входить в аккаунт 😁");
      } else {
        res.status(404);
      }
    } catch (error) {
      res.status(500).json({
        statos: "error",
        message: JSON.stringify(error),
      });
    }
  }

  async show(req, res) {
    try {
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        return res.status(400).send();
      }

      const user = await UserModel.findById(userId).populate("tweets").exec();

      if (!user) {
        return res.status(404).send();
      }

      res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({
        statos: "error",
        message: JSON.stringify(error),
      });
    }
  }

  async afterLogin(req, res) {
    try {
      const user = req.user ? req.user.toJSON() : undefined;
      res.json({
        status: "success",
        data: {
          ...user,
          token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || "123", {
            expiresIn: "30 days",
          }),
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }

  async getUserInfo(req, res) {
    // res.send(user)
    try {
      const user = await UserModel.findById(req.userId._id)
        .populate("tweets")
        .exec();
      console.log(req.userId);

      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  }
}

export const UserCtrl = new UserController();
{
  /* <a href=""></a>; */
}

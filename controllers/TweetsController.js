import { body, validationResult } from "express-validator";
import { UserModel } from "../models/UserModel.js";
import { generateMD5 } from "../utils/generateHash.js";
import { sendEmail } from "../utils/sendEmail.js";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { TweetsModel } from "../models/TweetsModel.js";

class TweetsController {
  async index(req, res) {
    try {
      const tweets = await TweetsModel.find({})
        .populate("user")
        .sort({ createdAt: "-1" })
        .exec();

      res.json({
        status: "success",
        data: tweets,
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
      // console.log(user);

      // if (user) {
      //   const errors = validationResult(req);
      //   if (!errors.isEmpty()) {
      //     console.log(errors);
      //     return res.json({
      //       status: "error",
      //     });
      //   }
      // } else {
      //   return res.json({
      //     message: "Вы не авторизованы!",
      //   });
      // }

      // console.log(info.text);
      const data = {
        text: req.body.text,
        images: req.body.images,
        user: req.userId._id,
      };

      const tweet = await TweetsModel.create(data);
      console.log(req.userId);

      req.userId.tweets.push(tweet._id);

      if (!tweet) {
        return res.json({
          status: "error",
          message: "Проищошла ошибка",
        });
      }

      res.status(200).json({
        status: "success",
        data: await tweet.populate("user"),
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: "Не удалось создать твит",
        error,
      });
    }
  }

  async delete(req, res) {
    const user = req.userId;

    try {
      if (user) {
        const tweetId = req.params.id;
        if (!isValidObjectId(tweetId)) {
          return res.status(400).send();
        }

        const tweet = await TweetsModel.findById(tweetId);

        if (tweet) {
          console.log(String(tweet.user._id), user._id);
          if (String(tweet.user._id) === String(user._id)) {
            await TweetsModel.deleteOne({ _id: tweetId });
            res.send();
          } else {
            res.status(403).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      console.log(error);
      res.json({
        message: "error",
        error,
      });
    }
  }

  async update(req, res) {
    const user = req.userId;

    try {
      if (user) {
        const tweetId = req.params.id;
        if (!isValidObjectId(tweetId)) {
          return res.status(400).send();
        }

        const tweet = await TweetsModel.findById(tweetId);

        if (tweet) {
          if (String(tweet.user._id) === String(user._id)) {
            const text = req.body.text;
            tweet.text = text;
            tweet.save();
            res.send();
          } else {
            res.status(403).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "error",
        error,
      });
    }
  }

  async verify(req, res) {
    try {
      const hash = req.query.hash;
      if (!hash) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findOne({ confirm_hash: hash }).exec();

      if (user) {
        user.confirmed = true;
        user.save();

        res.send("Ваш аккаунт подтверждён!");
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
      const tweetId = req.params.id;

      if (!isValidObjectId(tweetId)) {
        res.status(400).send();
        return;
      }

      const tweet = await TweetsModel.findById(tweetId).populate("user").exec();

      if (!tweet) {
        res.status(404).send();
        return;
      }

      res.status(200).json({ data: tweet });
    } catch (error) {
      res.status(500).json({
        statos: "error",
        message: JSON.stringify(error),
      });
    }
  }

  async getUserTweets(req, res) {
    try {
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        res.status(400).send();
        return;
      }

      const tweet = await TweetsModel.find({ user: userId })
        .populate("user")
        .exec();

      if (!tweet) {
        res.status(404).send();
        return;
      }

      res.status(200).json({ data: tweet });
    } catch (error) {
      res.status(500).json({
        statos: "error",
        message: JSON.stringify(error),
      });
    }
  }

  // async afterLogin(req, res) {
  //   const user = req.user ? req.user.toJSON() : undefined;
  //   try {
  //     res.json({
  //       status: "success",
  //       data: {
  //         ...user,
  //         token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || "123", {
  //           expiresIn: "30 days",
  //         }),
  //       },
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: "error",
  //       message: error,
  //     });
  //   }
  // }

  // async getUserInfo(req, res) {
  //   const user = req.user ? req.user.toJSON() : undefined;
  //   try {
  //     res.json({
  //       status: "success",
  //       data: user,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: "error",
  //       message: error,
  //     });
  //   }
  // }
}

export const TweetsCtrl = new TweetsController();

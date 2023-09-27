import { CommentsModel } from "../models/CommentsModel.js";
import { TweetsModel } from "../models/TweetsModel.js";
import mongoose from "mongoose";
const isValidObjectId = mongoose.Types.ObjectId.isValid;

class CommentsController {
  async getAll(req, res) {
    try {
      const comments = await CommentsModel.find({})
        .populate("user")
        .sort({ createdAt: "-1" })
        .exec();

      res.json({
        status: "success",
        data: comments,
      });
    } catch (error) {
      res.status(500).json({
        statos: "error",
        message: JSON.stringify(error),
      });
    }
  }
  async getCommentsUnderTweet(req, res) {
    try {
      const commentsUnderTweetId = req.params.id;

      if (!isValidObjectId(commentsUnderTweetId)) {
        res.status(400).send();
        return;
      }

      const tweet = await TweetsModel.findById(commentsUnderTweetId).exec();

      if (!tweet) {
        res.status(404).send();
        return;
      }

      const list = await Promise.all(
        tweet.comments.map((item) => {
          return CommentsModel.findById(item).populate("user").exec();
        })
      );

      if (!list) {
        res.status(404).send();
        return;
      }

      res.status(200).json({ data: list });
    } catch (error) {
      res.status(500).json({
        statos: "error",
        message: error,
      });
    }
  }
  async create(req, res) {
    try {
      const { id } = req.params;
      const data = {
        text: req.body.text,
        user: req.userId._id,
      };

      const comment = await CommentsModel.create(data);

      if (!comment) {
        return res.json({
          status: "error",
          message: "Проиzошла ошибка",
        });
      }

      await TweetsModel.findByIdAndUpdate(id, {
        $push: { comments: comment._id },
      });

      res.status(200).json({
        status: "success",
        data: await comment.populate("user"),
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: "Не удалось прокомментировать",
        error,
      });
    }
  }
}

export const CommentCtrl = new CommentsController();

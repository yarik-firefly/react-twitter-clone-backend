import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const TweetsSchema = new Schema(
  {
    text: {
      required: true,
      type: String,
      maxLength: 280,
    },
    user: {
      required: true,
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    images: Array,
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
  },
  { timestamps: true }
);

export const TweetsModel = model("Tweets", TweetsSchema);

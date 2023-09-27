import { Schema, model } from "mongoose";

const CommentsSchema = new Schema(
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
  },
  { timestamps: true }
);

export const CommentsModel = model("Comment", CommentsSchema);

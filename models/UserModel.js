import mongoose, { Schema, model } from "mongoose";

const UserSchema = mongoose.Schema(
  {
    email: {
      unique: true,
      required: true,
      type: String,
    },
    fullname: {
      required: true,
      type: String,
    },
    username: {
      unique: true,
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    confirmed: { type: Boolean, default: false },
    confirm_hash: {
      required: true,
      type: String,
    },
    tweets: [{ type: Schema.Types.ObjectId, ref: "Tweets" }],
    location: String,
    about: String,
    website: String,
    avatarUrl: String,
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  transform: (_, obj) => {
    delete obj.password;
    delete obj.confirm_hash;
    return obj;
  },
});

export const UserModel = model("User", UserSchema);

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/UserModel.js";
import { generateMD5 } from "../utils/generateHash.js";
import passport from "passport";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserModel.findOne({
        $or: [{ email: username }, { username }],
      }).exec();

      if (!user) {
        return done(null, false);
      }
      if (user.confirmed && user.password === generateMD5(password + process.env.SECRET_KEY)) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.SECRET_KEY || "123",
      jwtFromRequest: ExtractJwt.fromHeader("token"),
    },
    async (payload, next) => {
      console.log(data);

      try {
        const user = await UserModel.findById(payload.data._id).exec();

        if (user) {
          return next(null, user);
        }

        console.log(user);

        next(null, false);
      } catch (error) {
        next(error, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user?._id);
});

passport.deserializeUser(function (id, done) {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

export { passport };

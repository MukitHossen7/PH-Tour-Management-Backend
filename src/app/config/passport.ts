/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import config from "../../config";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

// credential Login use passPort.js
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: any) => {
      try {
        const isExistUser = await User.findOne({ email });
        if (!isExistUser) {
          return done(null, false, { message: "Email does not exist" });
        }

        if (isExistUser.isVerified === !true) {
          return done(null, false, { message: "Your account is not Verified" });
        }

        if (
          isExistUser.isActive === IsActive.BLOCKED ||
          isExistUser.isActive === IsActive.INACTIVE
        ) {
          return done(null, false, {
            message: "Your account is blocked or inactive",
          });
        }

        if (isExistUser.isDeleted === true) {
          return done(null, false, {
            message: "Your account is deleted",
          });
        }

        const isGoogleAuthenticated = isExistUser.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );

        if (isGoogleAuthenticated && !isExistUser.password) {
          return done(null, false, {
            message: "You have authenticated through Google",
          });
        }

        const isPasswordMatch = await bcrypt.compare(
          password as string,
          isExistUser.password as string
        );
        if (!isPasswordMatch) {
          return done(null, false, { message: "Password is incorrect" });
        }
        return done(null, isExistUser, {
          message: "User authenticated successfully",
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

//google Login use passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, {
            message: "No email associated with this account",
          });
        }
        let user = await User.findOne({ email });
        if (user && user.isVerified === !true) {
          return done(null, false, {
            message: "Your account is not Verified",
          });
        }

        if (
          user &&
          (user.isActive === IsActive.BLOCKED ||
            user.isActive === IsActive.INACTIVE)
        ) {
          return done(null, false, {
            message: "Your account is blocked or inactive",
          });
        }

        if (user && user.isDeleted === true) {
          return done(null, false, {
            message: "Your account is deleted",
          });
        }
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerID: profile.id,
              },
            ],
          });
        }
        return done(null, user, { message: "User authenticated successfully" });
      } catch (error) {
        return done(error, false, { message: "Google Strategy Error" });
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

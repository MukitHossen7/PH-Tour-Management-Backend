import express, { NextFunction, Request, Response } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import config from "../../../config";

const authRoute = express.Router();

authRoute.post("/login", authController.createLogin);
authRoute.post("/refresh-token", authController.createNewAccessToken);
authRoute.post("/logout", authController.logOutUser);
authRoute.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  authController.changePassword
);
authRoute.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  authController.setPassword
);
authRoute.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authController.resetPassword
);
authRoute.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${config.FRONTEND_URL}/login?error=There is some issues with your account.Please contact our support team`,
  }),
  authController.googleLogin
);
export default authRoute;

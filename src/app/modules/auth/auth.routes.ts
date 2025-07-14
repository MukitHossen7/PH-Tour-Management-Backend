import express, { NextFunction, Request, Response } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const authRoute = express.Router();

authRoute.post("/login", authController.createLogin);
authRoute.post("/refresh-token", authController.createNewAccessToken);
authRoute.post("/logout", authController.logOutUser);
authRoute.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authController.resetPassword
);
authRoute.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }
);

authRoute.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleLogin
);
export default authRoute;

import express from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const authRoute = express.Router();

authRoute.post("/login", authController.createLogin);
authRoute.post("/refresh-token", authController.createNewAccessToken);
authRoute.post("/logout", authController.logOutUser);
authRoute.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  authController.resetPassword
);

export default authRoute;

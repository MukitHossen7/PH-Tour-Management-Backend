import express from "express";
import { userControllers } from "./user.controller";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createUserZodSchema } from "./user.zod.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const userRoute = express.Router();

userRoute.post(
  "/register",
  zodValidateRequest(createUserZodSchema),
  userControllers.createUser
);
userRoute.get(
  "/",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  userControllers.getAllUsers
);

export default userRoute;

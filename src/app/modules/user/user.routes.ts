import express from "express";
import { userControllers } from "./user.controller";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createUserZodSchema } from "./user.zod.validation";

const userRoute = express.Router();

userRoute.post(
  "/register",
  zodValidateRequest(createUserZodSchema),
  userControllers.createUser
);
userRoute.get("/all-users", userControllers.getAllUsers);

export default userRoute;

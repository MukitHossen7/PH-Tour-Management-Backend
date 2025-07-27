import express from "express";
import { userControllers } from "./user.controller";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import { createUserZodSchema } from "./user.zod.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const userRoute = express.Router();

userRoute.post(
  "/register",
  zodValidateRequest(createUserZodSchema),
  userControllers.createUser
);
userRoute.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers
);
userRoute.get("/me", checkAuth(...Object.values(Role)), userControllers.getMe);

userRoute.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userControllers.updateUserById
);
export default userRoute;

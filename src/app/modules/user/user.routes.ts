import express from "express";
import { userControllers } from "./user.controller";

const userRoute = express.Router();

userRoute.post("/register", userControllers.createUser);
userRoute.get("/me", userControllers.getAllUsers);

export default userRoute;

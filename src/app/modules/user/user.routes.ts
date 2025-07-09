import express from "express";
import { userControllers } from "./user.controller";

const userRoute = express.Router();

userRoute.post("/register", userControllers.createUser);
userRoute.get("/all-users", userControllers.getAllUsers);

export default userRoute;

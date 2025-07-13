import express from "express";
import { authController } from "./auth.controller";

const authRoute = express.Router();

authRoute.post("/login", authController.createLogin);
authRoute.post("/refresh-token", authController.createNewAccessToken);

export default authRoute;

import express from "express";
import { OTPController } from "./otp.controller";

const optRoute = express.Router();

optRoute.post("/send", OTPController.sendOPT);
optRoute.post("/verify", OTPController.verifyOTP);
export default optRoute;

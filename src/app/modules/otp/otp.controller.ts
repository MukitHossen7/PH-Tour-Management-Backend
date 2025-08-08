import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { OTPService } from "./opt.services";

const sendOPT = catchAsync(async (req: Request, res: Response) => {
  const { email, name } = req.body;
  await OTPService.sendOPT(email, name);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Send OTP successfully",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP Verify successfully",
    data: null,
  });
});

export const OTPController = {
  sendOPT,
  verifyOTP,
};

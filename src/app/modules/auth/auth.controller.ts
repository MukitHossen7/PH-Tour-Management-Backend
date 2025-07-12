/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.createLogin(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Login Successfully",
      data: user,
    });
  }
);

export const authController = {
  createLogin,
};

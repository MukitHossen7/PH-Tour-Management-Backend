/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

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

const createNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const refreshToken = req.cookies.refreshToken;
    const refreshToken = req.headers.authorization;
    const tokenInfo = (await authService.createNewAccessToken(
      refreshToken as string
    )) as JwtPayload;
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Refresh Token create Successfully",
      data: tokenInfo,
    });
  }
);
export const authController = {
  createLogin,
  createNewAccessToken,
};

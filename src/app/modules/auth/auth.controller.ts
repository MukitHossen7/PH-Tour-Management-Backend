/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";

const createLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userInfo = await authService.createLogin(req.body);

    // res.cookie("accessToken", userInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    // res.cookie("refreshToken", userInfo.refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    setAuthCookie(res, userInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Login Successfully",
      data: userInfo,
    });
  }
);

const createNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
    }
    const tokenInfo = await authService.createNewAccessToken(
      refreshToken as string
    );
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });

    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token Retrieved Successfully",
      data: tokenInfo,
    });
  }
);

const logOutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

export const authController = {
  createLogin,
  createNewAccessToken,
  logOutUser,
};

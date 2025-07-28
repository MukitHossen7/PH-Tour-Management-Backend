/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userToken";
import config from "../../../config";
import passport from "passport";
import { JwtPayload } from "jsonwebtoken";

// cradientional login without passport.js
// const createLogin = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userInfo = await authService.createLogin(req.body);

//     // res.cookie("accessToken", userInfo.accessToken, {
//     //   httpOnly: true,
//     //   secure: false,
//     // });

//     // res.cookie("refreshToken", userInfo.refreshToken, {
//     //   httpOnly: true,
//     //   secure: false,
//     // });

//     setAuthCookie(res, userInfo);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "User Login Successfully",
//       data: userInfo,
//     });
//   }
// );

//cradientional login use passport.js
const createLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userToken = createUserTokens(user);

      const { password, ...rest } = user.toObject();
      setAuthCookie(res, userToken);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Login Successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
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

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    if (!decodedToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
    }
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    await authService.changePassword(decodedToken, newPassword, oldPassword);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset Successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;

    await authService.setPassword(decodedToken.id, password);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password set Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, id } = req.body;

    const decodedToken = req.user;
    if (!decodedToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
    }

    await authService.resetPassword(decodedToken, newPassword, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset Successfully",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    await authService.forgotPassword(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password forgot Successfully",
      data: null,
    });
  }
);

const googleLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectUrl = req.query.state ? (req.query.state as string) : "";
    if (redirectUrl.startsWith("/")) {
      redirectUrl = redirectUrl.slice(1);
    }
    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    // sendResponse(res, {
    //   statusCode: httpStatus.OK,
    //   success: true,
    //   message: "Password reset Successfully",
    //   data: null,
    // });
    res.redirect(`${config.FRONTEND_URL}/${redirectUrl}`);
  }
);

export const authController = {
  createLogin,
  createNewAccessToken,
  logOutUser,
  resetPassword,
  changePassword,
  setPassword,
  forgotPassword,
  googleLogin,
};

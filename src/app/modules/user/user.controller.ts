/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { verifyToken } from "../../utils/jwt";
import config from "../../../config";
import { JwtPayload } from "jsonwebtoken";
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Retrieved Successfully",
      data: user,
    });
  }
);
const updateUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const token = req.headers.authorization;
    const verify_token = verifyToken(
      token as string,
      config.jwt_secret as string
    ) as JwtPayload;

    const user = await userServices.updateUserById(
      userId,
      payload,
      verify_token
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Update Successfully",
      data: user,
    });
  }
);

export const userControllers = {
  createUser,
  getAllUsers,
  updateUserById,
};

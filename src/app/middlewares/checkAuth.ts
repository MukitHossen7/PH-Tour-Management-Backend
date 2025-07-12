import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(httpStatus.FORBIDDEN, "Access token is missing");
      }
      const verify_token = verifyToken(
        accessToken,
        config.jwt_secret as string
      ) as JwtPayload;

      if (!verify_token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token");
      }
      if (!authRoles.includes(verify_token.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource"
        );
      }
      // req.user = verify_token;
      next();
    } catch (error) {
      next(error);
    }
  };

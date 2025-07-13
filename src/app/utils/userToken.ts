import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const createUserTokens = (user: Partial<IUser>) => {
  const tokenPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  };
  const accessToken = generateToken(
    tokenPayload,
    config.jwt_secret as string,
    config.jwt_expiration as string
  );

  const refreshToken = generateToken(
    tokenPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiration as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const isExistUser = await User.findOne({ email: verifiedRefreshToken.email });
  if (!isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  if (
    isExistUser.isActive === IsActive.BLOCKED ||
    isExistUser.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is blocked or inactive"
    );
  }

  if (isExistUser.isDeleted === true) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is deleted");
  }

  const tokenPayload = {
    email: isExistUser.email,
    role: isExistUser.role,
    id: isExistUser._id,
  };
  const accessToken = generateToken(
    tokenPayload,
    config.jwt_secret as string,
    config.jwt_expiration as string
  );

  return {
    accessToken,
  };
};

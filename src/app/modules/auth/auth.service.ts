import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import config from "../../../config";
import { JwtPayload } from "jsonwebtoken";

const createLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isExistUser = await User.findOne({ email });
  if (!isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isExistUser.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect");
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

  const refreshToken = generateToken(
    tokenPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expiration as string
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isExistUser.toObject();
  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

const createNewAccessToken = async (refreshToken: string) => {
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

export const authService = {
  createLogin,
  createNewAccessToken,
};

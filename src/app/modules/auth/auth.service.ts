import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import config from "../../../config";

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

  return {
    accessToken,
    refreshToken,
    user: isExistUser,
  };
};

export const authService = {
  createLogin,
};

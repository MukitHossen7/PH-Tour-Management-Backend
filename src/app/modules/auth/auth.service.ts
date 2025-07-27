/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IAuthsProviders, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";

import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import config from "../../../config";

//cradientional login without passport.js
const createLogin = async (payload: Partial<IUser>) => {
  // const { email, password } = payload;
  // const isExistUser = await User.findOne({ email });
  // if (!isExistUser) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  // }
  // const isPasswordMatch = await bcrypt.compare(
  //   password as string,
  //   isExistUser.password as string
  // );
  // if (!isPasswordMatch) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect");
  // }

  // const userTokens = createUserTokens(isExistUser);
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { password: pass, ...rest } = isExistUser.toObject();
  // return {
  //   accessToken: userTokens.accessToken,
  //   refreshToken: userTokens.refreshToken,
  //   user: rest,
  // };
  return {};
};

const createNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken.accessToken,
  };
};

const changePassword = async (
  decodedToken: JwtPayload,
  newPassword: string,
  oldPassword: string
) => {
  const isExistUser = await User.findById(decodedToken.id);
  if (!isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "ID does not exist");
  }
  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    isExistUser.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  }
  isExistUser.password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  isExistUser.save();
};

const setPassword = async (id: string, password: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }
  if (
    user.password &&
    user.auths.some((providerObj) => providerObj.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already set your password. Now you can change the password from your profile"
    );
  }
  if (
    user.password &&
    user.auths.some((providerObj) => providerObj.provider === "credential")
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not google login user");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );
  const authProvider: IAuthsProviders = {
    provider: "credential",
    providerID: user.email,
  };
  user.auths = [...user.auths, authProvider];
  user.password = hashPassword;
  await user.save();
};

const resetPassword = async (
  decodedToken: JwtPayload,
  newPassword: string,
  oldPassword: string
) => {
  // const isExistUser = await User.findById(decodedToken.id);
  // if (!isExistUser) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "ID does not exist");
  // }
  // const isOldPasswordMatch = await bcrypt.compare(
  //   oldPassword,
  //   isExistUser.password as string
  // );
  // if (!isOldPasswordMatch) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  // }
  // isExistUser.password = await bcrypt.hash(
  //   newPassword,
  //   Number(config.bcrypt_salt_rounds)
  // );
  // isExistUser.save();
  return {};
};

const forgotPassword = async (
  decodedToken: JwtPayload,
  newPassword: string,
  oldPassword: string
) => {
  // const isExistUser = await User.findById(decodedToken.id);
  // if (!isExistUser) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "ID does not exist");
  // }
  // const isOldPasswordMatch = await bcrypt.compare(
  //   oldPassword,
  //   isExistUser.password as string
  // );
  // if (!isOldPasswordMatch) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  // }
  // isExistUser.password = await bcrypt.hash(
  //   newPassword,
  //   Number(config.bcrypt_salt_rounds)
  // );
  // isExistUser.save();
  return {};
};

export const authService = {
  createLogin,
  createNewAccessToken,
  resetPassword,
  setPassword,
  forgotPassword,
  changePassword,
};

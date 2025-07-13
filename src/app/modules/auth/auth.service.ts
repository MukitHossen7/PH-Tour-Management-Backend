import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";

import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";

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

  const userTokens = createUserTokens(isExistUser);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isExistUser.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const createNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken.accessToken,
  };
};

export const authService = {
  createLogin,
  createNewAccessToken,
};

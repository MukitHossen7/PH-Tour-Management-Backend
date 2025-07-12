import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";

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
  return {
    email: isExistUser.email,
  };
};

export const authService = {
  createLogin,
};

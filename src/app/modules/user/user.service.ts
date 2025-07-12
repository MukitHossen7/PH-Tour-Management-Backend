import AppError from "../../errorHelpers/AppError";
import { IAuthsProviders, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import config from "../../../config";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isExistUser = await User.findOne({ email });
  if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }
  const authProvider: IAuthsProviders = {
    provider: "credential",
    providerID: email as string,
  };

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(config.bcrypt_salt_rounds)
  );
  const user = await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};
export const userServices = {
  createUser,
  getAllUsers,
};

import AppError from "../../errorHelpers/AppError";
import { IAuthsProviders, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;
  const isExistUser = await User.findOne({ email });
  if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }
  const authProvider: IAuthsProviders = {
    provider: "credential",
    providerID: email as string,
  };
  const user = await User.create({ email, auths: [authProvider], ...rest });
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

import AppError from "../../errorHelpers/AppError";
import { IAuthsProviders, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { JwtPayload } from "jsonwebtoken";

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

const updateUserById = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to change user roles"
      );
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only Super Admin can assign Super Admin role"
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to change user roles"
      );
    }
  }
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password as string,
      Number(config.bcrypt_salt_rounds)
    );
  }
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};
export const userServices = {
  createUser,
  getAllUsers,
  updateUserById,
};

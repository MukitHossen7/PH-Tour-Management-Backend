/* eslint-disable no-console */
import config from "../../config";
import { IAuthsProviders, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      email: config.super_admin_email,
      role: "ADMIN",
    });
    if (isSuperAdminExists) {
      console.log("Super Admin already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(
      config.super_admin_password as string,
      Number(config.bcrypt_salt_rounds)
    );

    const authProvider: IAuthsProviders = {
      provider: "credential",
      providerID: config.super_admin_email as string,
    };
    const payload: IUser = {
      name: "Admin",
      email: config.super_admin_email as string,
      password: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
      auths: [authProvider],
    };
    await User.create(payload);
  } catch (error) {
    console.log(error);
  }
};

import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IAuthsProviders {
  provider: "google" | "credential"; //email, google
  providerID: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  auths: IAuthsProviders[];
  role: Role;
  booking?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}

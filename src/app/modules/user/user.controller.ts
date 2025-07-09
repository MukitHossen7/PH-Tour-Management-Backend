import { Request, Response } from "express";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "User created failed",
      success: false,
      error,
    });
  }
};

export const userControllers = {
  createUser,
};

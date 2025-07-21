/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import config from "../../config";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something Went Wrong!!";

  //duplicate error
  if (error.code === 11000) {
    const matchArray = error.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchArray[1]} already exists!!`;
  }
  // cast error
  else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoDB ObjectId. Please provide a valid id";
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    error,
    stack: config.node_env === "development" ? error.stack : null,
  });
};

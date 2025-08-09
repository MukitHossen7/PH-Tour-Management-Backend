import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { StatsService } from "./stats.service";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const user = await StatsService.getUserStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User  stats fetched successfully",
    data: user,
  });
});
const getBookingStats = catchAsync(async (req: Request, res: Response) => {
  const booking = await StatsService.getBookingStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking stats fetched successfully",
    data: booking,
  });
});

const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const tour = await StatsService.getTourStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour stats fetched successfully",
    data: tour,
  });
});
const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
  const payment = await StatsService.getPaymentStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "payment stats fetched successfully",
    data: payment,
  });
});

export const StatsController = {
  getUserStats,
  getBookingStats,
  getTourStats,
  getPaymentStats,
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DivisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IDivision } from "./division.interface";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IDivision = {
      ...req.body,
      thumbnail: req.file?.path,
    };
    const result = await DivisionService.createDivision(payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division created successfully",
      data: result,
    });
  }
);

const getAllDivisions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DivisionService.getAllDivisions();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division retrieve successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const result = await DivisionService.getSingleDivision(slug);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get single division successfully",
      data: result,
    });
  }
);

const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DivisionService.updateDivision(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division Update successfully",
      data: result,
    });
  }
);

const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DivisionService.deleteDivision(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division deleted successfully",
      data: result,
    });
  }
);

export const DivisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};

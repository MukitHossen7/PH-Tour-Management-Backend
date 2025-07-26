/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ITour } from "./tour.interface";

//Tour CRUD Operations
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[])?.map((file) => file.path),
    };

    const result = await TourService.createTour(payload);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour created successfully",
      data: result,
    });
  }
);

const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourData = res.locals.data;
    // const query = req.query;
    // const result = await TourService.getAllTours(
    //   query as Record<string, string>
    // );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Tours retrieved successfully",
      meta: tourData.meta,
      data: tourData.data,
    });
  }
);

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await TourService.getSingleTour(slug as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieved Single Tour successfully",
    data: result,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.updateTour(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTour(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour deleted successfully",
    data: result,
  });
});

//TourType CRUD Operations
const createTourType = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.createTourType(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour type created successfully",
    data: result,
  });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.getAllTourTypes();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await TourService.updateTourType(id, name);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTourType(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourTypes,
  updateTourType,
  deleteTourType,
};

import express from "express";
import { TourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.zod.validation";
import { queryBuilders } from "../../middlewares/queryBuilders";
import { Tour } from "./tour.model";
import { multerUpload } from "../../config/multer.config";

const tourRoute = express.Router();

// TOUR TYPE ROUTES

tourRoute.get("/tour-types", TourController.getAllTourTypes);

tourRoute.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValidateRequest(createTourTypeZodSchema),
  TourController.createTourType
);

tourRoute.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValidateRequest(createTourTypeZodSchema),
  TourController.updateTourType
);

tourRoute.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourType
);

//TOUR ROUTES
tourRoute.get(
  "/",
  queryBuilders(Tour, ["title", "description", "location"]),
  TourController.getAllTours
);

tourRoute.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  zodValidateRequest(createTourZodSchema),
  TourController.createTour
);

tourRoute.get("/:slug", TourController.getSingleTour);

tourRoute.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  zodValidateRequest(updateTourZodSchema),
  TourController.updateTour
);

tourRoute.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour
);

export default tourRoute;

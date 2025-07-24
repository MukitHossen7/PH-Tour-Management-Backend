import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { zodValidateRequest } from "../../middlewares/zodValidateRequest";
import {
  createBookingZodSchema,
  updateBookingStatusZodSchema,
} from "./booking.zod.validation";
import { BookingController } from "./booking.controller";

const bookingRoute = express.Router();

// api/v1/booking
bookingRoute.post(
  "/",
  checkAuth(...Object.values(Role)),
  zodValidateRequest(createBookingZodSchema),
  BookingController.createBooking
);

// api/v1/booking
bookingRoute.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getAllBookings
);

// api/v1/booking/my-bookings
bookingRoute.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  BookingController.getUserBookings
);

// api/v1/booking/bookingId
bookingRoute.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  BookingController.getSingleBooking
);

// api/v1/booking/bookingId/status
bookingRoute.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(Role)),
  zodValidateRequest(updateBookingStatusZodSchema),
  BookingController.updateBookingStatus
);

export default bookingRoute;

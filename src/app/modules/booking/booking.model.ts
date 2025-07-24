import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is Required"],
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Tour Id is Required"],
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    guestCount: {
      type: Number,
      required: [true, "GuestCount Id is Required"],
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Booking = model<IBooking>("Booking", bookingSchema);

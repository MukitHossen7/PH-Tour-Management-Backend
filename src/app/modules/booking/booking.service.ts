/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { getTransactionId } from "../../utils/getTransactionId";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update Your Profile to Book a Tour"
      );
    }
    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!");
    }
    if (!payload?.guestCount) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Guest Count Found!");
    }
    const amount = Number(tour?.costFrom) * Number(payload?.guestCount);

    const booking = await Booking.create(
      [
        {
          ...payload,
          user: userId,
          status: BOOKING_STATUS.PENDING,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transactionId: transactionId,
          status: PAYMENT_STATUS.UNPAID,
          amount: amount,
        },
      ],
      { session }
    );

    const updateBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const sslPayload: ISSLCommerz = {
      amount: amount,
      transactionId: transactionId,
      name: (updateBooking?.user as any)?.name,
      email: (updateBooking?.user as any)?.email,
      phoneNumber: (updateBooking?.user as any)?.phone,
      address: (updateBooking?.user as any)?.address,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    await session.commitTransaction();
    session.endSession();
    return {
      paymentUrl: sslPayment?.GatewayPageURL,
      booking: updateBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getUserBookings = async () => {
  return {};
};

const getBookingById = async () => {
  return {};
};

const updateBookingStatus = async () => {
  return {};
};

const getAllBookings = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};

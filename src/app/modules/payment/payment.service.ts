/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { generatePdf } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment not Found. you have not booked this tour"
    );
  }
  const bookingData = await Booking.findById(payment.booking).populate(
    "user",
    "name email phone address"
  );

  const sslPayload: ISSLCommerz = {
    amount: payment.amount,
    transactionId: payment.transactionId,
    name: (bookingData?.user as any)?.name,
    email: (bookingData?.user as any)?.email,
    phoneNumber: (bookingData?.user as any)?.phone,
    address: (bookingData?.user as any)?.address,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);
  return {
    sslPaymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );
    if (!updatePayment) {
      throw new AppError(httpStatus.NOT_FOUND, "update payment not found");
    }
    const updateBooking = await Booking.findByIdAndUpdate(
      updatePayment?.booking,

      { status: BOOKING_STATUS.COMPLETED },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email")
      .populate("tour", "title");
    if (!updateBooking) {
      throw new AppError(httpStatus.NOT_FOUND, "update booking not found");
    }
    const invoiceInfo = {
      transactionId: updatePayment?.transactionId as string,
      userName: (updateBooking?.user as unknown as IUser).name,
      tourTitle: (updateBooking.tour as unknown as ITour).title,
      totalAmount: updatePayment?.amount,
      guestCount: updateBooking.guestCount,
      bookingDate: updateBooking.createdAt as Date,
    };
    const pdfBuffer = await generatePdf(invoiceInfo);
    await sendEmail({
      to: (updateBooking?.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceInfo,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatePayment?.booking,

      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Failed" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatePayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session }
    );

    await Booking.findByIdAndUpdate(
      updatePayment?.booking,

      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "Payment Cancel" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};

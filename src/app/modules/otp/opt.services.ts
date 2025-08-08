import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
const OTP_EXPIRATION = 2 * 60;
const generateOtp = (length = 6) => {
  const opt = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return opt;
};

const sendOPT = async (email: string, name: string) => {
  const otp = generateOtp();
  const redisKey = `opt:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};
const verifyOTP = async () => {
  return null;
};

export const OTPService = {
  sendOPT,
  verifyOTP,
};

// ai file app ar vitor dita hoba in future korba ata

import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiration: process.env.JWT_EXPIRATION,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  SSL: {
    SSL_STORE_ID: process.env.SSL_STORE_ID as string,
    SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
    SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
    SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
    SLL_SUCCESS_BACKEND_URL: process.env.SLL_SUCCESS_BACKEND_URL as string,
    SLL_FAIL_BACKEND_URL: process.env.SLL_FAIL_BACKEND_URL as string,
    SLL_CANCEL_BACKEND_URL: process.env.SLL_CANCEL_BACKEND_URL as string,
    SLL_SUCCESS_FRONTEND_URL: process.env.SLL_SUCCESS_FRONTEND_URL as string,
    SLL_FAIL_FRONTEND_URL: process.env.SLL_FAIL_FRONTEND_URL as string,
    SLL_CANCEL_FRONTEND_URL: process.env.SLL_CANCEL_FRONTEND_URL as string,
  },
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  },
  EMAIL_SENDER: {
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    SMTP_FROM: process.env.SMTP_FROM as string,
  },
  REDIS: {
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  },
};

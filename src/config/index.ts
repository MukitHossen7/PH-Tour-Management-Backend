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
};

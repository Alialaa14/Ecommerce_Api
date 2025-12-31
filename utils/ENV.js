import { configDotenv } from "dotenv";

configDotenv();

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  NODE_ENV: process.env.NODE_ENV,
  SECRET_KEY: process.env.SECRET_KEY,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  CLOUD_NAME: process.env.CLOUD_NAME,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
};

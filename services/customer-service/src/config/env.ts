import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || `3002`, 10),
  mongodbUri: process.env.MONGODB_URI,

  apiHost: `${process.env.DEV_HOST}:${process.env.PORT}/v1`,

  env: process.env.NODE_ENV || `dev`,
  // Add other variables here
};

export default config;

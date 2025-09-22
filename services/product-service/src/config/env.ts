import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || `3002`, 10),
  mongodbUri:
    process.env.NODE_ENV === `test`
      ? process.env.MONGOURI_TEST
      : process.env.NODE_ENV === `dev`
      ? process.env.MONGOURI_DEV
      : process.env.NODE_ENV === `prod`
      ? process.env.MONGOURI_PROD
      : ``,

  apiHost:
    process.env.NODE_ENV === `prod`
      ? process.env.HOST_PROD
      : `${process.env.DEV_HOST}:${process.env.PORT}/v1`,

  env: process.env.NODE_ENV || `dev`,
  // Add other variables here
};

export default config;

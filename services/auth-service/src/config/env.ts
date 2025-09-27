import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || `3000`, 10),
  env: process.env.NODE_ENV || `dev`,
  mongodbUri: process.env.MONGODB_URI,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  jwtSecret: process.env.JWT_SECRET || `secret`,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || `refresh_secret`,

  // Add other variables here
};

export default config;

import mongoose from "mongoose";
import config from "./env";

async function connectToMongoDBAtlas() {
  const uri: string = config.mongodbUri || ``;
  if (!uri) {
    console.error(`MongoDB connection string is not defined in .env file`);
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ Database Connected Successfully`);
  } catch (error) {
    console.log(`Database Connection Error!!`, error);
    process.exit(1);
  }
}

process.on(`SIGINT`, async () => {
  console.log(`Closing MongoDB connection...`);
  await mongoose.connection.close();
  process.exit(0);
});

export default connectToMongoDBAtlas;

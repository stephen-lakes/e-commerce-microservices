import mongoose from "mongoose";
import config from "./env";
import Product from "../models/product.model";

async function connectToMongoDBAtlas() {
  const uri: string = config.mongodbUri || ``;
  if (!uri) {
    console.error(`MongoDB connection string is not defined in .env file`);
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ Database Connected Successfully`);

    await Product.deleteMany({});

    const p1 = await Product.create({
      name: `IPhone 16`,
      price: 2099.99,
      stock: 100,
    });
    const p2 = await Product.create({
      name: `Airpod`,
      price: 102.99,
      stock: 50,
    });
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

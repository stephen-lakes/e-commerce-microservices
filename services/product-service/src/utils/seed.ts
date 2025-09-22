import mongoose from "mongoose";
import Product from "../models/product.model";

const MONGO = process.env.MONGO_URL || "mongodb://localhost:27017/ecom";

export async function seed() {
  await mongoose.connect(MONGO);
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
  console.log(`seeded products`, p1, p2);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

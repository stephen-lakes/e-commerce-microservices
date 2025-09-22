import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../interfaces/product.interface";

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>(`Product`, ProductSchema);

export default Product;

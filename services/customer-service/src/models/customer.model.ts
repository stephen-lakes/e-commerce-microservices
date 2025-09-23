import mongoose, { Schema, Document } from "mongoose";
import { ICustomer } from "../interfaces/product.interface";

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model<ICustomer>(`Customer`, CustomerSchema);

export default Customer;

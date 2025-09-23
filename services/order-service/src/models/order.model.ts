import mongoose, { Schema, Document } from "mongoose";
import { IOrder } from "../interfaces/order.interface";

const OrderSchema: Schema = new Schema(
  {
    customerId: { type: String, required: true },
    productId: { type: String, required: true },
    amount: { type: Number, required: true },
    orderStatus: { type: String, default: `pending`, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>(`Order`, OrderSchema);

export default Order;

import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  customerId: string;
  orderId: string;
  productId: string;
  amount: number;
  status: string;
  createdAt: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema({
  customerId: { type: String, required: true },
  orderId: { type: String, required: true },
  productId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "success" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>("Transaction", transactionSchema);

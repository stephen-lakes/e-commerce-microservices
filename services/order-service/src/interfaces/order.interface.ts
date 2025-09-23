export interface IOrder extends Document {
  customerId: string;
  productId: string;
  amount: string;
  orderStatus: string;
}

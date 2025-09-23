import Order from "../models/order.model";

export class OrderService {
  static async fetchOrderById(id: string) {
    return await Order.findOne({ _id: id });
  }

  static async createOrder() {
    return await Order.find();
  }
}

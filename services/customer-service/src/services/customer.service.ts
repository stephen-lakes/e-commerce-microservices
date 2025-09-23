import Customer from "../models/customer.model";

export class CustomerService {
  static async fetchCustomerById(id: string) {
    return await Customer.findOne({ _id: id });
  }

  static async fetchAllCustomers() {
    return await Customer.find();
  }
}

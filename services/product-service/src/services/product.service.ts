import Product from '../models/product.model';

export class ProductService {
  static async getProductById(id: string) {
    return await Product.findOne({ _id: id });
  }

  static async getAllProducts() {
    return await Product.find();
  }
}

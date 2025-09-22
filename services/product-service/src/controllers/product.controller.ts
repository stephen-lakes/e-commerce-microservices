import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { sendResponse } from "../utils/utilities";
import { STATUS_ERROR, STATUS_SUCCESS } from "../config/constants";

const ProductController = {
  getProducts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await ProductService.getProductById(req.params.id);

      if (!product)
        sendResponse(res, {
          status: STATUS_ERROR,
          message: `product not found`,
          code: 404,
        });
    } catch (error) {
      next(error);
    }
  },

  getProductById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await ProductService.getAllProducts();
      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `products`,
        code: 200,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ProductController;

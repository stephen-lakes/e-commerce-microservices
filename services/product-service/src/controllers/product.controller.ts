import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { sendResponse } from "../utils/utilities";
import { ERROR_CODES, STATUS_ERROR, STATUS_SUCCESS } from "../config/constants";
import { HttpException } from "../exceptions/http.exception";

const ProductController = {
  getProducts: async (
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

  getProductById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await ProductService.getProductById(req.params.id);

      if (!product)
        return next(
          new HttpException(
            404,
            STATUS_ERROR,
            `product with the ID ${req.params.id} not found`,
            ERROR_CODES.ERR_CODE_404
          )
        );

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `product not found`,
        code: 200,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default ProductController;

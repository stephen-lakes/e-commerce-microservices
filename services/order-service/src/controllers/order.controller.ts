import { NextFunction, Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { sendResponse } from "../utils/utilities";
import { ERROR_CODES, STATUS_ERROR, STATUS_SUCCESS } from "../config/constants";
import { HttpException } from "../exceptions/http.exception";

const OrderController = {
  createOrder: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { customerId, productId, amount } = req.body;

      if (!customerId || !productId) {
        return next(
          new HttpException(
            400,
            STATUS_ERROR,
            `customerId and productId required`,
            ERROR_CODES.ERR_CODE_400
          )
        );
      }

      const PRODUCT_URL = process.env.PRODUCT_URL || "http://localhost:3002";
      const p = await fetch(`${PRODUCT_URL}/products/${productId}`);
      if (!p.ok)
        return next(
          new HttpException(
            404,
            STATUS_ERROR,
            `product not found`,
            ERROR_CODES.ERR_CODE_400
          )
        );
      const prod = await p.json();

      const CUSTOMER_URL = process.env.CUSTOMER_URL || "http://localhost:3001";
      const cRes = await fetch(`${CUSTOMER_URL}/customers/${customerId}`);
      if (!cRes.ok)
        return next(
          new HttpException(
            404,
            STATUS_ERROR,
            `customer not found`,
            ERROR_CODES.ERR_CODE_400
          )
        );

      const order = await OrderService.createOrder({
        customerId,
        productId,
        amount,
      });

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `order`,
        code: 200,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  getOrderById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const order = await OrderService.fetchOrderById(req.params.id);

      if (!order)
        return next(
          new HttpException(
            404,
            STATUS_ERROR,
            `order with the ID ${req.params.id} not found`,
            ERROR_CODES.ERR_CODE_404
          )
        );

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `order`,
        code: 200,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default OrderController;

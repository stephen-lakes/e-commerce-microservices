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

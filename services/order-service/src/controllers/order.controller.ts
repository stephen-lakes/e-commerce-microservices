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
      const customers = await OrderService.createOrder();
      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `customers`,
        code: 200,
        data: customers,
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
      const customer = await OrderService.fetchOrderById(req.params.id);

      if (!customer)
        return next(
          new HttpException(
            404,
            STATUS_ERROR,
            `customer with the ID ${req.params.id} not found`,
            ERROR_CODES.ERR_CODE_404
          )
        );

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `customer`,
        code: 200,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default OrderController;

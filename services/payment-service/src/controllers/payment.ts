import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/utilities";
import { ERROR_CODES, STATUS_ERROR, STATUS_SUCCESS } from "../config/constants";
import { HttpException } from "../exceptions/http.exception";
import { publishEvent } from "../events/publisher";

const PaymentController = {
  makePayment: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { customerId, orderId, productId, amount } = req.body;

    if (!customerId || !orderId || !productId || !amount) {
      return next(
        new HttpException(
          400,
          STATUS_ERROR,
          `Missing required fields`,
          ERROR_CODES.ERR_CODE_400
        )
      );
    }

    // Simulate a successful transaction
    const transaction = {
      customerId,
      orderId,
      productId,
      amount,
      status: `success`,
      createdAt: new Date().toISOString(),
    };

    try {
      await publishEvent({
        queue: `transactions`,
        data: transaction,
      });

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `transaction successful`,
        code: 200,
        data: transaction,
      });
    } catch (error) {}
  },
};

export default PaymentController;

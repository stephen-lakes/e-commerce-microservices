import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http.exception";
import { STATUS_ERROR } from "../config/constants";

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const statusNo: number = error.statusNo || 500;
    const status: string = error.status || STATUS_ERROR;
    const message: string = error.message || `Something went wrong`;
    const errorCode: string = error.errorCode || `E000`;
    const errors = error.errors || [];

    console.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );
    if (errors.length > 0) {
      res
        .status(statusNo)
        .json({ status: STATUS_ERROR, errorCode, message, errors });
    } else {
      res.status(statusNo).json({ status: STATUS_ERROR, errorCode, message });
    }
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;

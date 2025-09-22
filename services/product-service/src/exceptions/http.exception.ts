import { ValidationError } from "class-validator";
import { STATUS_ERROR } from "../config/constants";

export class HttpException extends Error {
  public statusNo: number;
  public status: string;
  public message: string;
  public errorCode: string;
  public errors: ValidationError[];

  constructor(
    statusNo: number,
    status: string,
    message: string,
    errorCode: string,
    errors?: ValidationError[]
  ) {
    super(message);
    this.statusNo = statusNo;
    this.status = status;
    this.message = message;
    this.errorCode = errorCode || STATUS_ERROR;
    this.errors = errors ?? [];
  }
}

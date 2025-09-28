import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http.exception";
import { ERROR_CODES, STATUS_ERROR } from "../config/constants";
import { AuthenticatedUser } from "../types";
import JWTService from "../services/jwt.service";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HttpException(
        401,
        STATUS_ERROR,
        "Unauthorized: No token provided",
        ERROR_CODES.ERR_CODE_401
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = new JWTService().decodeToken(token) as AuthenticatedUser;

    if (!decoded?.id) {
      throw new HttpException(
        401,
        STATUS_ERROR,
        "Invalid token: missing user ID",
        ERROR_CODES.ERR_CODE_401
      );
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}

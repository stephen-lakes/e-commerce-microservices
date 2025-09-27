import { NextFunction, Request, Response } from "express";
import { ERROR_CODES, STATUS_ERROR, STATUS_FAIL } from "../config/constants";
import JWTService from "../services/jwt.service";
import { HttpException } from "../exceptions/http.exception";
import { sendResponse } from "../utils/utilities";
import { IUser } from "../interfaces/user.interface";
import UserService from "../services/user.service";
import { AuthenticatedUser } from "../types";
import TokenService from "../services/token.service";

const tokenService = new TokenService();

const extractTokenFromHeader = (authHeader?: string): string => {
  if (!authHeader?.startsWith(`Bearer `)) {
    throw new HttpException(
      401,
      STATUS_ERROR,
      `Unauthorized: No token provided`,
      ERROR_CODES.ERR_CODE_401
    );
  }
  return authHeader.replace(`Bearer `, ``);
};

export const getUser = async (authString: string): Promise<IUser | null> => {
  try {
    const token = extractTokenFromHeader(authString);
    const decoded = new JWTService().verifyAccessToken(
      token
    ) as AuthenticatedUser;
    return await new UserService().getUserById(decoded.id);
  } catch {
    return null;
  }
};

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authString = req.header(`Authorization`);
    const token = extractTokenFromHeader(authString);
    const decoded = new JWTService().verifyAccessToken(
      token
    ) as AuthenticatedUser;

    if (!decoded?.id) {
      throw new HttpException(
        400,
        STATUS_ERROR,
        `Invalid token`,
        ERROR_CODES.ERR_CODE_400
      );
    }

    // Check blacklist
    const isBlacklisted = await tokenService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new HttpException(
        401,
        STATUS_ERROR,
        `Invalid token: please sign in`,
        ERROR_CODES.ERR_CODE_401
      );
    }

    const user = await new UserService().getUserById(decoded.id);

    if (!user) {
      return sendResponse(res, {
        status: STATUS_FAIL,
        message: `User not found`,
        code: 404,
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authString = req.header(`Authorization`);
  if (!authString?.startsWith(`Bearer `)) {
    return next(
      new HttpException(
        401,
        STATUS_ERROR,
        `Unauthorized: No token provided`,
        ERROR_CODES.ERR_CODE_401
      )
    );
  }

  const token = authString.replace(`Bearer `, ``);
  const decoded = new JWTService().verifyAccessToken(
    token
  ) as AuthenticatedUser;

  if (!decoded?.id) {
    throw new HttpException(
      401,
      STATUS_ERROR,
      `Invalid token: missing user ID`,
      ERROR_CODES.ERR_CODE_401
    );
  }

  if (decoded?.role !== `admin`) {
    throw new HttpException(
      401,
      STATUS_ERROR,
      `User is not an admin`,
      ERROR_CODES.ERR_CODE_401
    );
  }

  const user = await new UserService().getUserById(decoded.id);

  if (!user) {
    return sendResponse(res, {
      status: STATUS_FAIL,
      message: `User not found`,
      code: 404,
    });
  }

  req.user = decoded;
};

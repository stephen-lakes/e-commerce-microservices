import jwt from "jsonwebtoken";
import config from "../config/env";
import { HttpException } from "../exceptions/http.exception";
import { ERROR_CODES } from "../config/constants";

class JWTService {
  private secretKey: string;

  constructor() {
    this.secretKey = config.jwtSecret || process.env.JWT_SECRET || ``;
    if (!this.secretKey) {
      throw new Error(`JWT_SECRET is not defined in environment variables`);
    }
  }

  public decodeToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new HttpException(
          401,
          "TokenExpired",
          "Token has expired. Please log in again",
          ERROR_CODES.ERR_CODE_401
        );
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new HttpException(
          401,
          "InvalidToken",
          "Invalid token. Authentication failed",
          ERROR_CODES.ERR_CODE_401
        );
      } else {
        throw new HttpException(
          401,
          "AuthError",
          "Authentication error. Please try again",
          ERROR_CODES.ERR_CODE_401
        );
      }
    }
  }
}

export default JWTService;

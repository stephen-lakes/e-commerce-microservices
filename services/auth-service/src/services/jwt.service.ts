import jwt from "jsonwebtoken";
import config from "../config/env";
import { UserPayload } from "../interfaces/user.interface";

class JWTService {
  private accessSecret: string;
  private refreshSecret: string;

  constructor() {
    this.accessSecret = config.jwtSecret || process.env.JWT_SECRET || ``;
    this.refreshSecret =
      config.jwtRefreshSecret || process.env.JWT_REFRESH_SECRET || ``;

    if (!this.accessSecret) {
      throw new Error(`JWT_SECRET is not defined in environment variables.`);
    }
    if (!this.refreshSecret) {
      throw new Error(
        `JWT_REFRESH_SECRET is not defined in environment variables.`
      );
    }
  }

  private generatePayload(user: UserPayload): Record<string, unknown> {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  public createAccessToken(user: UserPayload): string {
    return jwt.sign(this.generatePayload(user), this.accessSecret, {
      expiresIn: `1h`,
    });
  }

  public createRefreshToken(user: UserPayload): string {
    return jwt.sign(this.generatePayload(user), this.refreshSecret, {
      expiresIn: `90d`,
    });
  }

  public verifyAccessToken(token: string): UserPayload {
    return this.verifyToken(token, this.accessSecret);
  }

  public verifyRefreshToken(token: string): UserPayload {
    return this.verifyToken(token, this.refreshSecret);
  }

  private verifyToken(token: string, secret: string): UserPayload {
    try {
      return jwt.verify(token, secret) as UserPayload;
    } catch (error: any) {
      const message =
        error.name === `TokenExpiredError`
          ? `Token has expired. Please log in again.`
          : error.name === `JsonWebTokenError`
          ? `Invalid token. Authentication failed.`
          : `Authentication error. Please try again.`;

      throw new Error(message);
    }
  }
}

export default JWTService;

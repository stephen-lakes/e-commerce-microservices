import { NextFunction, Request, Response } from "express";
import {
  signupSchema,
  signinSchema,
  refreshTokenSchema,
  signoutSchema,
} from "../validators/auth.validator";
import { HttpException } from "../exceptions/http.exception";
import AuthService from "../services/auth.service";
import { hideSensitiveData, sendResponse } from "../utils/utilities";
import UserService from "../services/user.service";
import JWTService from "../services/jwt.service";
import {
  ERROR_CODES,
  STATUS_ERROR,
  STATUS_FAIL,
  STATUS_SUCCESS,
} from "../config/constants";
import { UserPayload } from "../interfaces/user.interface";
import TokenService from "../services/token.service";

const userService = new UserService();
const authService = new AuthService();
const jwtService = new JWTService();
const tokenService = new TokenService();

const AuthController = {
  signup: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = signupSchema.validate(req.body);
      if (error) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            error.details[0].message,
            ERROR_CODES.ERR_CODE_400
          )
        );
      }

      const user = await authService.signup(value);

      const expiresIn = new Date();
      expiresIn.setMinutes(expiresIn.getMinutes() + 10);

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `Sign up successful`,
        data: { user: hideSensitiveData(user) },
        code: 200,
      });
    } catch (err) {
      next(err);
    }
  },

  signin: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = signinSchema.validate(req.body);
      if (error) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            error.details[0].message,
            ERROR_CODES.ERR_CODE_400
          )
        );
      }

      const { email, username, password } = value;
      const user = await authService.signin({
        email,
        username,
        password,
      });

      const accessToken = jwtService.createAccessToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
      const refreshToken = jwtService.createRefreshToken({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      await tokenService.storeRefreshToken(
        user.id,
        refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      );

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `Sign in successful`,
        data: { user: hideSensitiveData(user), accessToken, refreshToken },
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },

  signout: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = signoutSchema.validate(req.body);
      if (error) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            error.details[0].message,
            ERROR_CODES.ERR_CODE_400
          )
        );
      }

      const authHeader = req.headers[`authorization`];
      const accessToken = authHeader?.split(` `)[1];

      if (accessToken) {
        const decoded: any = jwtService.verifyAccessToken(accessToken);
        await tokenService.blacklistToken(
          accessToken,
          new Date(decoded.exp * 1000)
        );
      }

      // Remove refresh token if provided
      const { refreshToken } = value;
      if (refreshToken) {
        await tokenService.invalidateRefreshToken(refreshToken);
      }

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `Signed out successfully`,
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = refreshTokenSchema.validate(req.body);
      if (error) {
        return next(
          new HttpException(
            400,
            STATUS_FAIL,
            error.details[0].message,
            ERROR_CODES.ERR_CODE_400
          )
        );
      }

      const { refreshToken } = value;

      const payload: UserPayload = jwtService.verifyRefreshToken(refreshToken);

      await tokenService.invalidateRefreshToken(refreshToken);

      const newAccessToken = jwtService.createAccessToken(payload);
      const newRefreshToken = jwtService.createRefreshToken(payload);

      const refreshTokenExpiry = 90 * 24 * 60 * 60 * 1000; // 90 days

      await tokenService.storeRefreshToken(
        payload.id,
        newRefreshToken,
        new Date(Date.now() + refreshTokenExpiry)
      );

      const isMobileClient =
        req.headers[`user-agent`]?.includes(`okhttp`) ||
        req.headers[`x-mobile-client`];

      const responsePayload: Record<string, string> = {
        accessToken: newAccessToken,
      };

      if (!isMobileClient) {
        res.cookie(`refreshToken`, newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: `strict`,
          path: `/auth/refresh`,
          maxAge: refreshTokenExpiry,
        });
      } else {
        responsePayload.refreshToken = newRefreshToken;
      }

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `access token and refresh token generated successfully`,
        data: responsePayload,
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;

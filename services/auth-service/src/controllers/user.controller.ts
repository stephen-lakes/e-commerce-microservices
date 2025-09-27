import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http.exception";
import { hideSensitiveData, sendResponse } from "../utils/utilities";
import {
  ERROR_CODES,
  STATUS_ERROR,
  STATUS_FAIL,
  STATUS_SUCCESS,
} from "../config/constants";
import UserService from "../services/user.service";
import { updateUserSchema } from "../validators/user.validator";

const userService = new UserService();

const UserController = {
  getUsers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `Successfully fetched users`,
        data: await userService.getUsers(),
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;

    // TODOS:
    // denormalize followers
    // check isFollowing

    try {
      const user = await userService.getUserById(id);

      if (!user)
        return next(
          new HttpException(
            404,
            STATUS_ERROR,
            `User with the ID ${id} not found`,
            ERROR_CODES.ERR_CODE_404
          )
        );

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `Successfully fetched user details`,
        data: hideSensitiveData(user),
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },

  getUserByUsername: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { username } = req.params;
    try {
      const user = await userService.getUserByUsername(username);

      if (!user)
        return next(
          new HttpException(
            404,
            STATUS_ERROR,
            `User with the username ${username} not found`,
            ERROR_CODES.ERR_CODE_404
          )
        );

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: ``,
        data: hideSensitiveData(user),
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
      return next(
        new HttpException(
          404,
          STATUS_ERROR,
          `User with the id ${userId} not found`,
          ERROR_CODES.ERR_CODE_404
        )
      );
    }

    const profile = await userService.getProfile(userId);

    try {
      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `Profile fetched successfully `,
        data: profile,
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = req.user;

    try {
      const { error, value } = updateUserSchema.validate(req.body);
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

      if (!user) {
        return next(
          new HttpException(
            401,
            STATUS_FAIL,
            "Unauthorized: user not found in request",
            ERROR_CODES.ERR_CODE_401
          )
        );
      }

      const updated = userService.update(user.email, value);

      sendResponse(res, {
        status: STATUS_SUCCESS,
        message: `Profile updated successfully`,
        data: {
          updated,
        },
        code: 200,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;

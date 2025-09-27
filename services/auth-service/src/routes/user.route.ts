import { responseFormatter, Utility } from "../utils/utilities";
import UserController from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { UserSample } from "../samples/user.sample";
import { AuthSample } from "../samples/auth.sample";

export const UserRoute = Utility.swaggerRouteToAppRoute({
  path: `users`,
  controller: UserController,
  routes: [
    {
      route: `/`,
      method: `get`,
      handlerName: `getUsers`,
      description: `users`,
      sampleResponseData: responseFormatter(UserSample.userList),
    },
    {
      route: `/user/me`,
      method: `get`,
      handlerName: `getProfile`,
      description: `get current user's profile`,
      middlewares: [authenticateUser],
      sampleResponseData: responseFormatter(UserSample.me),
    },
    {
      route: `/user/me`,
      method: `put`,
      handlerName: `updateProfile`,
      description: `update current user profile by Id - public info`,
      middlewares: [authenticateUser],
      sampleRequestData: UserSample.updateUser,
      sampleResponseData: responseFormatter(UserSample.me),
    },
    {
      route: `/user/:username`,
      method: `get`,
      handlerName: `getUserByUsername`,
      description: `get user profile by username - public info`,
      middlewares: [authenticateUser],
      parameters: [
        {
          name: `username`,
          in: `path`,
          required: true,
          description: `user's username`,
          schema: { type: `string`, example: `JohnDoe` },
        },
      ],
      sampleResponseData: responseFormatter(UserSample.userPublic),
    },
    {
      route: `/admin/users/:id/verify`,
      method: `put`,
      handlerName: `getUserById`,
      description: `mark a user as verified - admin use`,
      parameters: [
        {
          name: `id`,
          in: `path`,
          required: true,
          description: `user Id`,
          schema: { type: `string`, example: AuthSample.user.id },
        },
      ],
      middlewares: [authenticateUser],
      sampleResponseData: responseFormatter(`user marked as verified`),
    },
    {
      route: `/:id`,
      method: `get`,
      handlerName: `getUserById`,
      description: `get user profile by Id - public info`,
      middlewares: [authenticateUser],
      parameters: [
        {
          name: `id`,
          in: `path`,
          required: true,
          description: `user Id`,
          schema: { type: `string`, example: UserSample.me.id },
        },
      ],
      sampleResponseData: responseFormatter(UserSample.userPublic),
    },
  ],
});

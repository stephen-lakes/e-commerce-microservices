import AuthController from "../controllers/auth.controller";
import { responseFormatter, Utility } from "../utils/utilities";
import { AuthSample } from "../samples/auth.sample";
import { authenticateUser } from "../middlewares/auth.middleware";

export const AuthRoute = Utility.swaggerRouteToAppRoute({
  path: `auth`,
  controller: AuthController,
  routes: [
    {
      route: `/sign-up`,
      method: `post`,
      handlerName: `signup`,
      description: `Signup endpoint`,
      sampleRequestData: AuthSample.signup,
      sampleResponseData: responseFormatter(AuthSample.signupSuccess),
    },
    {
      route: `/sign-in`,
      method: `post`,
      handlerName: `signin`,
      description: `Signin endpoint`,
      sampleRequestData: AuthSample.signin,
      sampleResponseData: responseFormatter(AuthSample.signinSuccess),
    },
    {
      route: `/sign-out`,
      method: `post`,
      handlerName: `signout`,
      description: `Signout endpoint`,
      middlewares: [authenticateUser],
      sampleResponseData: responseFormatter({}),
    },
    {
      route: `/refresh`,
      method: `post`,
      handlerName: `refreshToken`,
      description: `get a new access token`,
      sampleRequestData: AuthSample.token,
      sampleResponseData: responseFormatter(AuthSample.refresh),
    },
  ],
});

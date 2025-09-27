import { Router, Response, RequestHandler } from "express";
import { ERROR_CODES, STATUS_ERROR, STATUS_SUCCESS } from "../config/constants";
import { HttpException } from "../exceptions/http.exception";

export function hideSensitiveData(user: Record<string, any>) {
  return {
    id: user._id.toString(),
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    profileUrl: user.profileUrl,
    followerCount: user.followerCount,
    postCount: user.postCount,
    bio: user.bio,
    location: user.location,
    isVerified: user.isVerified,
  };
}

export function LogError(errorObj: {}, description: string) {
  console.log(JSON.stringify({ description, error: errorObj }));
}

export const EErrorCode = {
  /** Unclassified error resulting from caught exceptions */
  ERROR_CODE_000: "err-000",
  /** Invalid, Expired or Missing Token */
  ERROR_CODE_AUTH_001: "auth-001",
  /** Unathorized */
  ERROR_CODE_AUTH_002: "auth-002",
  /** Validation for sign in failed */
  ERROR_CODE_AUTH_003: "auth-003",
  /** User not found */
  ERROR_CODE_AUTH_004: "auth-004",
  /** Password is incorrect */
  ERROR_CODE_AUTH_005: "auth-005",
  /** Validation for sign up failed */
  ERROR_CODE_AUTH_006: "auth-006",
  /** Unique constraint failure during sign up */
  ERROR_CODE_AUTH_007: "auth-007",
  /** Validation failed for OTP generation */
  ERROR_CODE_OTP_001: "otp-001",
  /** Validation failed for OTP validation */
  ERROR_CODE_OTP_002: "otp-002",
  /** Invalid OTP */
  ERROR_CODE_OTP_003: "otp-003",
  /** Item not found */
  ERROR_CODE_404: "err-404",
  /** Poorly formed request */
  ERROR_CODE_400: "err-400",
} as const;

export type EErrorCode = (typeof EErrorCode)[keyof typeof EErrorCode];

export interface IErrorStructure {
  message?: string;
  errorCode?: EErrorCode;
  statusNo?: number;
  errorObject?: {};
}

export const throwException = (error: IErrorStructure) => {
  throw new HttpException(
    error.statusNo || 400,
    STATUS_ERROR,
    error.message!,
    error.errorCode || "E-000",
    Array.isArray(error?.errorObject)
      ? error?.errorObject
      : [error?.errorObject]
  );
};

/**
 * Standard response sender
 */
export function sendResponse(
  res: Response,
  payload?: {
    status?: string;
    message?: string;
    data?: any;
    code?: number;
  }
) {
  res.status(payload?.code || 200).json({
    status: payload?.status || STATUS_SUCCESS,
    message: payload?.message || `Success`,
    data: payload?.data,
  });
}

export function responseFormatter<T>(data: T, message = `success`) {
  return {
    status: STATUS_SUCCESS,
    message,
    data,
  };
}

type HttpMethod = `get` | `post` | `put` | `delete` | `patch`;

export interface SwaggerParameter {
  name: string;
  in: `query` | `path` | `header` | `cookie`;
  required: boolean;
  description?: string;
  schema?: {
    type: string;
    enum?: string[];
    default?: any;
    example?: any;
  };
}

export interface RouteDefinition {
  route: string;
  method: HttpMethod;
  handlerName: string;
  description?: string;
  middlewares?: RequestHandler[];
  parameters?: SwaggerParameter[];
  requestContentType?: string;
  sampleRequestData?: Record<string, any>;
  sampleResponseData?: Record<string, any>;
}

export interface SwaggerRouteConfig {
  path: string;
  controller: Record<string, RequestHandler>;
  routes: RouteDefinition[];
  tag?: string;
}

/**
 * In-memory Swagger metadata store
 */
export const swaggerMetadataStore: Record<string, any> = {};

/**
 * Converts Express-style param paths to Swagger format (e.g. :id → {id})
 */
function expressPathToSwaggerPath(path: string): string {
  return path.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
}

/**
 * Utility class
 */
export class Utility {
  static convertToSwaggerSchema(obj: Record<string, any>) {
    const schema: Record<string, any> = {};

    for (const key in obj) {
      const value = obj[key];

      if (key === `files` || key === `file`) {
        schema[key] =
          key === `files`
            ? {
                type: `array`,
                items: {
                  type: `string`,
                  format: `binary`,
                },
              }
            : {
                type: `string`,
                format: `binary`,
              };
      } else {
        // fallback - infer type using typeof
        schema[key] = { type: typeof value };
      }
    }

    return schema;
  }

  static swaggerRouteToAppRoute(config: SwaggerRouteConfig) {
    const router = Router();
    const {
      path: basePath,
      controller,
      routes,
      tag = capitalizeFirstLetter(basePath),
    } = config;

    routes.forEach(
      ({
        route,
        method,
        handlerName,
        description,
        middlewares = [],
        parameters = [],
        requestContentType,
        sampleRequestData,
        sampleResponseData,
      }) => {
        const expressPath = `/${basePath}${route}`;
        const swaggerPath = expressPathToSwaggerPath(expressPath);
        const handler = controller[handlerName];

        if (typeof handler !== `function`) {
          throw new Error(
            `Handler "${handlerName}" not found in controller for path: ${expressPath}`
          );
        }

        (router as any)[method](expressPath, ...middlewares, handler);

        // Store Swagger metadata
        swaggerMetadataStore[swaggerPath] ??= {};
        swaggerMetadataStore[swaggerPath][method] = {
          summary: description || ``,
          tags: [tag],
          security: [{ bearerAuth: [] }],
          parameters,
          requestBody:
            requestContentType === "multipart/form-data"
              ? {
                  required: true,
                  content: {
                    "multipart/form-data": {
                      schema: {
                        type: `object`,
                        properties: {
                          ...Utility.convertToSwaggerSchema(
                            sampleRequestData || {}
                          ),
                        },
                      },
                    },
                  },
                }
              : sampleRequestData && Object.keys(sampleRequestData).length
              ? {
                  content: {
                    "application/json": {
                      example: sampleRequestData,
                    },
                  },
                }
              : undefined,

          responses: {
            200: {
              description: `Success`,
              content: {
                "application/json": {
                  example: sampleResponseData || {},
                },
              },
            },
            400: {
              description: `Failed`,
              content: {
                "application/json": {
                  example: {
                    status: `error`,
                    message: `Bad request. Check your input and try again`,
                    errorCode: ERROR_CODES.ERR_CODE_400,
                  },
                },
              },
            },
            401: {
              description: `Unauthorized`,
              content: {
                "application/json": {
                  example: {
                    status: `error`,
                    message: `Authentication failed. Token is missing, expired, or invalid`,
                    errorCode: ERROR_CODES.ERR_CODE_401,
                  },
                },
              },
            },
            403: {
              description: `Forbidden`,
              content: {
                "application/json": {
                  example: {
                    status: `error`,
                    message: `User not authorized to access this resource`,
                    errorCode: ERROR_CODES.ERR_CODE_403,
                  },
                },
              },
            },
            404: {
              description: `Not Found`,
              content: {
                "application/json": {
                  example: {
                    status: `error`,
                    message: `Not found`,
                    errorCode: ERROR_CODES.ERR_CODE_404,
                  },
                },
              },
            },
            500: {
              description: `Internal Server Error`,
              content: {
                "application/json": {
                  example: {
                    status: `error`,
                    message: `Internal server. Please try again later`,
                    errorCode: ERROR_CODES.ERR_CODE_500,
                  },
                },
              },
            },
          },
        };
      }
    );

    return router;
  }
}

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Helper: fallback username generator from email or provider-specific default.
 * Ensure uniqueness in production by checking DB and appending numbers if needed.
 */
export function generateUsernameFromEmail(email?: string, provider?: string) {
  if (email) {
    const namePart = email.split(`@`)[0];
    return `${namePart}`.replace(/[^a-zA-Z0-9._-]/g, ``).toLowerCase();
  }
  return `${provider}_user_${Math.random().toString(36).slice(2, 9)}`;
}

import { Router, RequestHandler, Response } from "express";
import { ERROR_CODES, STATUS_SUCCESS } from "../config/constants";

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

      if (key === `files`) {
        // Handle multiple file uploads
        schema[key] = {
          type: `array`,
          items: {
            type: `string`,
            format: `binary`,
          },
        };
        continue;
      }

      if (key === `file`) {
        // Handle single file upload
        schema[key] = {
          type: `string`,
          format: `binary`,
        };
        continue;
      }

      // Fallback: infer type using typeof
      const type = typeof value;
      schema[key] = { type };
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
            requestContentType === `multipart/form-data`
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
            204: {
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

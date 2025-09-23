import dotenv from "dotenv";
import { AppName } from "./config/constants";
import express, { Application, Request, Response, NextFunction } from "express";
import config from "./config/env";
import { unknownEndpoint } from "./middlewares/unknownEndpoint";
import connectToMongoDBAtlas from "./config/database";
import errorMiddleware from "./middlewares/error.middleware";
import { Swagger } from "./swagger";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

dotenv.config();

class App {
  private BASE_URL = `/api/v1`;
  private PORT: number | string;
  private app: Application;
  private env: string;

  constructor(routes: express.Router[]) {
    this.app = express();
    this.PORT = config.port || process.env.PORT || 3002;
    this.env = config.env || process.env.ENV || `dev`;

    this.initializeDatabase();

    this.initializeSwagger();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();

    // Custom middleware for request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await connectToMongoDBAtlas();
    } catch (error) {
      console.error(`Error connecting to the database:`, error);
      process.exit(1);
    }
  }

  private initializeRoutes(routes: express.Router[]) {
    this.app.get(`${this.BASE_URL}`, (req, res) => {
      res.status(200).send({ message: `Welcome to ${AppName} 🚀` });
    });

    routes.forEach((route) => this.app.use(`${this.BASE_URL}`, route));

    this.app.use(unknownEndpoint);
  }

  private initializeSwagger() {
    this.app.use(
      `/api-docs`,
      swaggerUI.serve,
      swaggerUI.setup(
        swaggerJSDoc({
          definition: {
            openapi: `3.1.0`,
            info: {
              title: AppName,
              version: `1.0.0`,
              description: `${AppName} endpoints`,
            },
            servers: [
              {
                url: `http://localhost:${this.PORT}${this.BASE_URL}`,
                description: `${config.env}`,
              },
            ],
            components: {
              securitySchemes: {
                bearerAuth: {
                  type: `http`,
                  scheme: `bearer`,
                  bearerFormat: `JWT`,
                },
              },
            },
            paths: Swagger.pathGen(),
          },
          apis: [],
        }),
        {
          explorer: true,
          customSiteTitle: `${AppName} Swagger`,
        }
      )
    );
  }

  public listen(): void {
    this.app.listen(this.PORT, () => {
      console.log(`
        =================================
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        =================================
        ✨  ${AppName}  ✨
        🎧 Listening on port ${this.PORT} 🚀
        Mode: ${this.env}
        =================================
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        =================================
      `);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;

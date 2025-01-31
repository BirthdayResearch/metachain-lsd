import {
  INestApplication,
  NestApplicationOptions,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./AppModule";

/**
 * App which starts the default MarbleFi Lsd Server Application
 */
export class MarbleFiLsdServerApp<
  App extends NestFastifyApplication = NestFastifyApplication,
> {
  protected app?: App;

  constructor(protected readonly module: any) {}

  get nestApplicationOptions(): NestApplicationOptions {
    return {
      bufferLogs: true,
    };
  }

  get fastifyAdapter(): FastifyAdapter {
    return new FastifyAdapter();
  }

  async createNestApp(): Promise<App> {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      this.fastifyAdapter,
    );
    await this.configureApp(app);
    // Register the middleware to log the origin
    this.registerLoggerMiddleware(app);
    return app as App;
  }

  async configureApp(app: INestApplication): Promise<void> {
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      origin:
        process.env.NODE_ENV === "production"
          ? [
              "https://marblefi.netlify.app/",
              /https:\/\/([^.]*.)--marblefi\.netlify\.app/, // allow all netlify preview deployments
            ]
          : "*",
      allowedHeaders: "*",
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      maxAge: 60 * 24 * 7,
    });
  }

  // Middleware to log the origin
  private registerLoggerMiddleware(app: INestApplication): void {
    app.use((req, res: any, next) => {
      const origin = req.headers.origin;
      console.log(`Request Origin: ${origin}`);
      next();
    });
  }

  /**
   * Run any additional initialisation steps before starting the server.
   * If there are additional steps, can be overriden by any extending classes
   */
  async init() {
    this.app = await this.createNestApp();
    return this.app.init();
  }

  async start(): Promise<App> {
    const app = await this.init();

    const PORT = process.env.PORT || 5741;
    await app.listen(PORT, "::").then(() => {
      // eslint-disable-next-line no-console
      console.log(`Started server on port ${PORT}`);
    });
    return app;
  }

  /**
   * Stop NestJs and un-assign this.app
   */
  async stop(): Promise<void> {
    await this.app?.close();
    this.app = undefined;
  }
}

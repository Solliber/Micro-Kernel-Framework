import express from 'express';

import {
  errorHandler,
  notFoundHandler,
  securityHeaders,
} from './Middleware.js';

export class ExpressAdapter {
  #app;
  #server;

  constructor(config) {
    if (!config || typeof config.get !== 'function') {
      throw new TypeError(
        'ExpressAdapter requires a configuration instance.',
      );
    }

    this.#app = express();

    this.#app.disable('x-powered-by');

    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: false }));

    this.#app.use(securityHeaders);

    this.#app.get('/health', (_request, response) => {
      response.status(200).json({
        status: 'ok',
      });
    });

    this.#app.use(notFoundHandler);
    this.#app.use(errorHandler);

    this.host = config.get(
      'server.host',
      '127.0.0.1',
    );

    this.port = config.get(
      'server.port',
      3000,
    );
  }

  get app() {
    return this.#app;
  }

  use(...middleware) {
    this.#app.use(...middleware);

    return this;
  }

  mount(path, router) {
    if (!router) {
      throw new TypeError(
        'A router is required.',
      );
    }

    this.#app.use(path, router.path ?? router);

    return this;
  }

  setViewEngine(engine, viewsPath) {
    this.#app.set('view engine', engine);
    this.#app.set('views', viewsPath);

    return this;
  }

  async start() {
    if (this.#server) {
      throw new Error(
        'Express server is already running.',
      );
    }

    await new Promise((resolve, reject) => {
      const server = this.#app.listen(
        this.port,
        this.host,
        () => {
          this.#server = server;
          resolve();
        },
      );

      server.once('error', reject);
    });

    return this;
  }

  async stop() {
    if (!this.#server) {
      return;
    }

    const server = this.#server;

    this.#server = undefined;

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}
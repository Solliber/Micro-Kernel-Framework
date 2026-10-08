import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Kernel } from '../kernel/Kernel.js';
import { JsonStore } from '../storage/JsonStore.js';
import { ExpressAdapter } from '../web/ExpressAdapter.js';
import { ViewRenderer } from '../web/ViewRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../..');

export class Application extends Kernel {
  #web;
  #views;

  constructor(config = {}) {
    super({
      environment: config.environment ?? 'development',

      server: {
        host: config.server?.host ?? '127.0.0.1',
        port: config.server?.port ?? 3000,
      },

      paths: {
        root: projectRoot,
        views:
          config.paths?.views ??
          path.join(projectRoot, 'views'),
        data:
          config.paths?.data ??
          path.join(projectRoot, 'data'),
      },
    });

    this.#views = new ViewRenderer(
      this.config.get('paths.views'),
    );

    this.#web = new ExpressAdapter(this.config);

    this.container
      .set('application', this)
      .set('kernel', this)
      .set('web', this.#web)
      .set('views', this.#views);

    this.#configureRoutes();
  }

  get web() {
    return this.#web;
  }

  get views() {
    return this.#views;
  }

  async boot() {
    const store = new JsonStore(
      path.join(
        this.config.get('paths.data'),
        'application.json',
      ),
    );

    await store.load();

    this.container.set(
      'storage',
      store,
    );

    return super.boot();
  }

  async start() {
    await super.start();

    await this.#web.start();

    await this.events.emit(
      'application:started',
      this,
    );

    return this;
  }

  async shutdown() {
    await this.#web.stop();

    await super.shutdown();

    await this.events.emit(
      'application:stopped',
      this,
    );
  }

  #configureRoutes() {
    this.#web.app.get(
      '/',
      async (_request, response, next) => {
        try {
          const html = await this.#views.render(
            'home',
            {
              application: this,
            },
          );

          response.type('html').send(html);
        } catch (error) {
          next(error);
        }
      },
    );
  }
}
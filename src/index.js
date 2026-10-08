import { Application } from './application/Application.js';

const application = new Application({
  environment: process.env.NODE_ENV ?? 'development',

  server: {
    host: process.env.HOST ?? '127.0.0.1',
    port: Number.parseInt(
      process.env.PORT ?? '3000',
      10,
    ),
  },
});

const shutdown = async (signal) => {
  console.log({
    level: 'info',
    event: 'application.shutdown',
    signal,
  });

  try {
    await application.shutdown();
    process.exit(0);
  } catch (error) {
    console.error({
      level: 'error',
      event: 'application.shutdown.failed',
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

process.once('SIGINT', () => {
  void shutdown('SIGINT');
});

process.once('SIGTERM', () => {
  void shutdown('SIGTERM');
});

try {
  await application.boot();
  await application.start();

  console.log({
    level: 'info',
    event: 'application.started',
    host: application.config.get('server.host'),
    port: application.config.get('server.port'),
  });
} catch (error) {
  console.error({
    level: 'error',
    event: 'application.start.failed',
    message: error.message,
    stack: error.stack,
  });

  process.exit(1);
}
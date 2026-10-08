import { describe, expect, it } from 'vitest';

import { Config } from '../src/kernel/Config.js';

describe('Config', () => {
  it('retrieves top-level values', () => {
    const config = new Config({
      environment: 'development',
    });

    expect(config.get('environment')).toBe(
      'development',
    );
  });

  it('retrieves nested values', () => {
    const config = new Config({
      server: {
        host: '127.0.0.1',
        port: 3000,
      },
    });

    expect(config.get('server.host')).toBe(
      '127.0.0.1',
    );

    expect(config.get('server.port')).toBe(3000);
  });

  it('returns defaults for missing values', () => {
    const config = new Config();

    expect(
      config.get('missing', 'fallback'),
    ).toBe('fallback');
  });

  it('checks whether a value exists', () => {
    const config = new Config({
      app: {
        name: 'micro-kernel',
      },
    });

    expect(config.has('app.name')).toBe(true);
    expect(config.has('app.version')).toBe(false);
  });
});
import { describe, expect, it } from 'vitest';

import { Kernel } from '../src/kernel/Kernel.js';

describe('Kernel', () => {
  it('registers modules and plugins', () => {
    const kernel = new Kernel();

    const module = {
      name: 'test-module',
    };

    const plugin = {
      name: 'test-plugin',
    };

    kernel
      .registerModule(module)
      .registerPlugin(plugin);

    expect(kernel.modules).toContain(module);
    expect(kernel.plugins).toContain(plugin);
  });

  it('runs the lifecycle in the correct order', async () => {
    const kernel = new Kernel();
    const events = [];

    kernel.registerModule({
      name: 'module',

      register() {
        events.push('module.register');
      },

      boot() {
        events.push('module.boot');
      },

      start() {
        events.push('module.start');
      },

      stop() {
        events.push('module.stop');
      },
    });

    kernel.registerPlugin({
      name: 'plugin',

      register() {
        events.push('plugin.register');
      },

      boot() {
        events.push('plugin.boot');
      },

      start() {
        events.push('plugin.start');
      },

      stop() {
        events.push('plugin.stop');
      },
    });

    await kernel.boot();

    expect(kernel.lifecycle.state).toBe('booted');

    await kernel.start();

    expect(kernel.lifecycle.state).toBe('started');

    await kernel.shutdown();

    expect(kernel.lifecycle.state).toBe('stopped');

    expect(events).toEqual([
      'module.register',
      'plugin.register',
      'module.boot',
      'plugin.boot',
      'module.start',
      'plugin.start',
      'plugin.stop',
      'module.stop',
    ]);
  });

  it('prevents duplicate module names', () => {
    const kernel = new Kernel();

    kernel.registerModule({
      name: 'example',
    });

    expect(() => {
      kernel.registerModule({
        name: 'example',
      });
    }).toThrow();
  });

  it('prevents duplicate plugin names', () => {
    const kernel = new Kernel();

    kernel.registerPlugin({
      name: 'example',
    });

    expect(() => {
      kernel.registerPlugin({
        name: 'example',
      });
    }).toThrow();
  });
});
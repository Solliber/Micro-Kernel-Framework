import { describe, expect, it } from 'vitest';

import { Events } from '../src/kernel/Events.js';

describe('Events', () => {
  it('emits events to registered listeners', async () => {
    const events = new Events();
    const received = [];

    events.on('test', (payload) => {
      received.push(payload);
    });

    await events.emit('test', {
      value: 42,
    });

    expect(received).toEqual([
      {
        value: 42,
      },
    ]);
  });

  it('supports asynchronous listeners', async () => {
    const events = new Events();
    let completed = false;

    events.on('test', async () => {
      await Promise.resolve();
      completed = true;
    });

    await events.emit('test');

    expect(completed).toBe(true);
  });

  it('allows listeners to unsubscribe', async () => {
    const events = new Events();
    let calls = 0;

    const unsubscribe = events.on('test', () => {
      calls += 1;
    });

    unsubscribe();

    await events.emit('test');

    expect(calls).toBe(0);
  });
});
import { describe, expect, it } from 'vitest';

import { Lifecycle } from '../src/kernel/Lifecycle.js';

describe('Lifecycle', () => {
  it('starts in the created state', () => {
    const lifecycle = new Lifecycle();

    expect(lifecycle.state).toBe('created');
  });

  it('supports valid transitions', () => {
    const lifecycle = new Lifecycle();

    lifecycle
      .transition('configured')
      .transition('registered')
      .transition('booted')
      .transition('started')
      .transition('stopped')
      .transition('destroyed');

    expect(lifecycle.state).toBe('destroyed');
  });

  it('rejects invalid transitions', () => {
    const lifecycle = new Lifecycle();

    expect(() => {
      lifecycle.transition('started');
    }).toThrow();
  });

  it('rejects unknown states', () => {
    const lifecycle = new Lifecycle();

    expect(() => {
      lifecycle.transition('invalid');
    }).toThrow();
  });
});
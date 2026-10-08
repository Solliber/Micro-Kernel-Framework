import { describe, expect, it } from 'vitest';

import { Container } from '../src/kernel/Container.js';

describe('Container', () => {
  it('stores and retrieves a binding', () => {
    const container = new Container();
    const service = { name: 'service' };

    container.set('service', service);

    expect(container.get('service')).toBe(service);
  });

  it('reports whether a binding exists', () => {
    const container = new Container();

    container.set('service', {});

    expect(container.has('service')).toBe(true);
    expect(container.has('missing')).toBe(false);
  });

  it('returns a default value for missing bindings', () => {
    const container = new Container();

    expect(
      container.getOrDefault('missing', 'fallback'),
    ).toBe('fallback');
  });

  it('removes bindings', () => {
    const container = new Container();

    container.set('service', {});

    expect(container.remove('service')).toBe(true);
    expect(container.has('service')).toBe(false);
  });

  it('rejects invalid binding names', () => {
    const container = new Container();

    expect(() => container.set('', {})).toThrow(
      TypeError,
    );
  });
});
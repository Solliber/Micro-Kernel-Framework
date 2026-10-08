export class Events {
  #listeners = new Map();

  on(event, listener) {
    if (typeof event !== 'string' || event.trim() === '') {
      throw new TypeError('Event name must be a non-empty string.');
    }

    if (typeof listener !== 'function') {
      throw new TypeError('Event listener must be a function.');
    }

    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }

    const listeners = this.#listeners.get(event);

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  async emit(event, payload = undefined) {
    const listeners = this.#listeners.get(event);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      await listener(payload);
    }
  }

  clear(event = undefined) {
    if (event === undefined) {
      this.#listeners.clear();
      return;
    }

    this.#listeners.delete(event);
  }
}
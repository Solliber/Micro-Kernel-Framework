export class Container {
  #bindings = new Map();

  set(name, value) {
    this.#validateName(name);
    this.#bindings.set(name, value);

    return this;
  }

  has(name) {
    this.#validateName(name);

    return this.#bindings.has(name);
  }

  get(name) {
    this.#validateName(name);

    if (!this.#bindings.has(name)) {
      throw new Error(`Container binding not found: ${name}`);
    }

    return this.#bindings.get(name);
  }

  getOrDefault(name, defaultValue) {
    this.#validateName(name);

    return this.#bindings.has(name)
      ? this.#bindings.get(name)
      : defaultValue;
  }

  remove(name) {
    this.#validateName(name);

    return this.#bindings.delete(name);
  }

  clear() {
    this.#bindings.clear();
  }

  #validateName(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new TypeError('Container binding name must be a non-empty string.');
    }
  }
}
export class Config {
  #values;

  constructor(values = {}) {
    if (!values || typeof values !== 'object' || Array.isArray(values)) {
      throw new TypeError('Configuration must be an object.');
    }

    this.#values = structuredClone(values);
  }

  has(path) {
    return this.#resolve(path) !== undefined;
  }

  get(path, defaultValue = undefined) {
    const value = this.#resolve(path);

    return value === undefined ? defaultValue : value;
  }

  all() {
    return structuredClone(this.#values);
  }

  #resolve(path) {
    if (typeof path !== 'string' || path.trim() === '') {
      throw new TypeError('Configuration path must be a non-empty string.');
    }

    return path.split('.').reduce((value, key) => {
      if (value === null || value === undefined) {
        return undefined;
      }

      return value[key];
    }, this.#values);
  }
}
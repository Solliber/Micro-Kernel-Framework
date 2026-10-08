export class ModuleRegistry {
  #modules = new Map();

  register(module) {
    this.#validate(module);

    if (this.#modules.has(module.name)) {
      throw new Error(`Module already registered: ${module.name}`);
    }

    this.#modules.set(module.name, module);

    return this;
  }

  has(name) {
    this.#validateName(name);

    return this.#modules.has(name);
  }

  get(name) {
    this.#validateName(name);

    if (!this.#modules.has(name)) {
      throw new Error(`Module not found: ${name}`);
    }

    return this.#modules.get(name);
  }

  all() {
    return [...this.#modules.values()];
  }

  remove(name) {
    this.#validateName(name);

    return this.#modules.delete(name);
  }

  clear() {
    this.#modules.clear();
  }

  #validate(module) {
    if (!module || typeof module !== 'object') {
      throw new TypeError('Module must be an object.');
    }

    if (
      typeof module.name !== 'string' ||
      module.name.trim() === ''
    ) {
      throw new TypeError(
        'Module name must be a non-empty string.',
      );
    }
  }

  #validateName(name) {
    if (
      typeof name !== 'string' ||
      name.trim() === ''
    ) {
      throw new TypeError(
        'Module name must be a non-empty string.',
      );
    }
  }
}
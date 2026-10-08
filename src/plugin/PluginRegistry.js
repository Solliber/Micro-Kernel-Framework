export class PluginRegistry {
  #plugins = new Map();

  register(plugin) {
    this.#validate(plugin);

    if (this.#plugins.has(plugin.name)) {
      throw new Error(`Plugin already registered: ${plugin.name}`);
    }

    this.#plugins.set(plugin.name, plugin);

    return this;
  }

  has(name) {
    this.#validateName(name);

    return this.#plugins.has(name);
  }

  get(name) {
    this.#validateName(name);

    if (!this.#plugins.has(name)) {
      throw new Error(`Plugin not found: ${name}`);
    }

    return this.#plugins.get(name);
  }

  all() {
    return [...this.#plugins.values()];
  }

  remove(name) {
    this.#validateName(name);

    return this.#plugins.delete(name);
  }

  clear() {
    this.#plugins.clear();
  }

  #validate(plugin) {
    if (!plugin || typeof plugin !== 'object') {
      throw new TypeError('Plugin must be an object.');
    }

    if (
      typeof plugin.name !== 'string' ||
      plugin.name.trim() === ''
    ) {
      throw new TypeError(
        'Plugin name must be a non-empty string.',
      );
    }
  }

  #validateName(name) {
    if (
      typeof name !== 'string' ||
      name.trim() === ''
    ) {
      throw new TypeError(
        'Plugin name must be a non-empty string.',
      );
    }
  }
}
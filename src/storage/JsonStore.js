import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class JsonStore {
  #filePath;
  #data;
  #loaded = false;

  constructor(filePath) {
    if (typeof filePath !== 'string' || filePath.trim() === '') {
      throw new TypeError('JSON store file path must be a non-empty string.');
    }

    this.#filePath = path.resolve(filePath);
    this.#data = {};
  }

  get filePath() {
    return this.#filePath;
  }

  async load() {
    if (this.#loaded) {
      return this;
    }

    try {
      const content = await readFile(this.#filePath, 'utf8');

      if (content.trim() === '') {
        this.#data = {};
      } else {
        this.#data = JSON.parse(content);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw new Error(
          `Unable to load JSON store: ${error.message}`,
        );
      }

      this.#data = {};
      await this.#persist();
    }

    this.#loaded = true;

    return this;
  }

  has(key) {
    this.#assertLoaded();
    this.#validateKey(key);

    return Object.hasOwn(this.#data, key);
  }

  get(key, defaultValue = undefined) {
    this.#assertLoaded();
    this.#validateKey(key);

    return Object.hasOwn(this.#data, key)
      ? structuredClone(this.#data[key])
      : defaultValue;
  }

  set(key, value) {
    this.#assertLoaded();
    this.#validateKey(key);

    this.#data[key] = structuredClone(value);

    return this;
  }

  delete(key) {
    this.#assertLoaded();
    this.#validateKey(key);

    return delete this.#data[key];
  }

  all() {
    this.#assertLoaded();

    return structuredClone(this.#data);
  }

  async save() {
    this.#assertLoaded();

    await this.#persist();

    return this;
  }

  async clear() {
    this.#assertLoaded();

    this.#data = {};

    await this.#persist();

    return this;
  }

  #assertLoaded() {
    if (!this.#loaded) {
      throw new Error(
        'JSON store must be loaded before it can be accessed.',
      );
    }
  }

  #validateKey(key) {
    if (typeof key !== 'string' || key.trim() === '') {
      throw new TypeError(
        'JSON store key must be a non-empty string.',
      );
    }
  }

  async #persist() {
    await mkdir(path.dirname(this.#filePath), {
      recursive: true,
    });

    await writeFile(
      this.#filePath,
      `${JSON.stringify(this.#data, null, 2)}\n`,
      'utf8',
    );
  }
}
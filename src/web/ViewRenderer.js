import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ejs from 'ejs';

export class ViewRenderer {
  #viewsPath;

  constructor(viewsPath) {
    if (
      typeof viewsPath !== 'string' ||
      viewsPath.trim() === ''
    ) {
      throw new TypeError(
        'Views path must be a non-empty string.',
      );
    }

    this.#viewsPath = path.resolve(viewsPath);
  }

  async render(view, data = {}) {
    this.#validateView(view);

    const filePath = path.join(
      this.#viewsPath,
      `${view}.ejs`,
    );

    const template = await readFile(filePath, 'utf8');

    return ejs.render(template, data, {
      filename: filePath,
      async: false,
    });
  }

  #validateView(view) {
    if (
      typeof view !== 'string' ||
      view.trim() === ''
    ) {
      throw new TypeError(
        'View name must be a non-empty string.',
      );
    }

    if (
      view.startsWith('/') ||
      view.includes('..') ||
      !/^[a-zA-Z0-9_/-]+$/.test(view)
    ) {
      throw new Error(`Invalid view name: ${view}`);
    }
  }
}
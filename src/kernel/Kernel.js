import { Config } from './Config.js';
import { Container } from './Container.js';
import { Events } from './Events.js';
import { Lifecycle } from './Lifecycle.js';

export class Kernel {
  #booted = false;

  constructor(config = {}) {
    this.container = new Container();
    this.config = new Config(config);
    this.events = new Events();
    this.lifecycle = new Lifecycle();

    this.modules = [];
    this.plugins = [];
  }

  registerModule(module) {
    this.#validateComponent(module, 'module', this.modules);

    this.modules.push(module);

    return this;
  }

  registerPlugin(plugin) {
    this.#validateComponent(plugin, 'plugin', this.plugins);

    this.plugins.push(plugin);

    return this;
  }

  async boot() {
    if (!this.lifecycle.is('created')) {
      throw new Error(
        `Kernel cannot boot from state: ${this.lifecycle.state}`,
      );
    }

    this.lifecycle.transition('configured');

    for (const module of this.modules) {
      if (typeof module.register === 'function') {
        await module.register(this);
      }
    }

    for (const plugin of this.plugins) {
      if (typeof plugin.register === 'function') {
        await plugin.register(this);
      }
    }

    this.lifecycle.transition('registered');

    await this.events.emit('kernel:registered', this);

    for (const module of this.modules) {
      if (typeof module.boot === 'function') {
        await module.boot(this);
      }
    }

    for (const plugin of this.plugins) {
      if (typeof plugin.boot === 'function') {
        await plugin.boot(this);
      }
    }

    this.lifecycle.transition('booted');

    await this.events.emit('kernel:booted', this);

    this.#booted = true;

    return this;
  }

  async start() {
    if (!this.#booted || !this.lifecycle.is('booted')) {
      throw new Error('Kernel must be booted before it can start.');
    }

    for (const module of this.modules) {
      if (typeof module.start === 'function') {
        await module.start(this);
      }
    }

    for (const plugin of this.plugins) {
      if (typeof plugin.start === 'function') {
        await plugin.start(this);
      }
    }

    this.lifecycle.transition('started');

    await this.events.emit('kernel:started', this);

    return this;
  }

  async shutdown() {
    if (!this.lifecycle.is('started')) {
      return;
    }

    for (const plugin of [...this.plugins].reverse()) {
      if (typeof plugin.stop === 'function') {
        await plugin.stop(this);
      }
    }

    for (const module of [...this.modules].reverse()) {
      if (typeof module.stop === 'function') {
        await module.stop(this);
      }
    }

    this.lifecycle.transition('stopped');

    await this.events.emit('kernel:stopped', this);
  }

  async destroy() {
    if (this.lifecycle.is('started')) {
      await this.shutdown();
    }

    if (!this.lifecycle.is('stopped')) {
      return;
    }

    for (const plugin of [...this.plugins].reverse()) {
      if (typeof plugin.destroy === 'function') {
        await plugin.destroy(this);
      }
    }

    for (const module of [...this.modules].reverse()) {
      if (typeof module.destroy === 'function') {
        await module.destroy(this);
      }
    }

    this.container.clear();
    this.events.clear();

    this.lifecycle.transition('destroyed');
  }

  #validateComponent(component, type, collection) {
    if (!component || typeof component !== 'object') {
      throw new TypeError(`${type} must be an object.`);
    }

    if (typeof component.name !== 'string' || component.name.trim() === '') {
      throw new TypeError(`${type} must have a non-empty name.`);
    }

    if (collection.some((item) => item.name === component.name)) {
      throw new Error(
        `Duplicate ${type} registration: ${component.name}`,
      );
    }
  }
}
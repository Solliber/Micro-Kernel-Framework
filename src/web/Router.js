export class Router {
  #router;

  constructor(express) {
    if (!express || typeof express.Router !== 'function') {
      throw new TypeError(
        'A valid Express instance is required.',
      );
    }

    this.#router = express.Router();
  }

  get path() {
    return this.#router;
  }

  get(route, handler) {
    this.#router.get(route, handler);

    return this;
  }

  post(route, handler) {
    this.#router.post(route, handler);

    return this;
  }

  put(route, handler) {
    this.#router.put(route, handler);

    return this;
  }

  patch(route, handler) {
    this.#router.patch(route, handler);

    return this;
  }

  delete(route, handler) {
    this.#router.delete(route, handler);

    return this;
  }

  use(...middleware) {
    this.#router.use(...middleware);

    return this;
  }
}
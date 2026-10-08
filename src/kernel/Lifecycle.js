const STATES = Object.freeze([
  'created',
  'configured',
  'registered',
  'booted',
  'started',
  'stopped',
  'destroyed',
]);

const TRANSITIONS = Object.freeze({
  created: ['configured'],
  configured: ['registered'],
  registered: ['booted'],
  booted: ['started'],
  started: ['stopped'],
  stopped: ['destroyed'],
  destroyed: [],
});

export class Lifecycle {
  #state = 'created';

  get state() {
    return this.#state;
  }

  transition(nextState) {
    if (!STATES.includes(nextState)) {
      throw new Error(`Unknown lifecycle state: ${nextState}`);
    }

    const allowedStates = TRANSITIONS[this.#state];

    if (!allowedStates.includes(nextState)) {
      throw new Error(
        `Invalid lifecycle transition: ${this.#state} -> ${nextState}`,
      );
    }

    this.#state = nextState;

    return this;
  }

  is(state) {
    return this.#state === state;
  }
}
import EventEmitter from 'eventemitter3';

/**
 * Handles events that are fired by GUI elements, using bindings and triggers.
 */
export class EventManager {
  /**
   * Defines the Geona-specific names for useful functions.
   */
  constructor() {
    this.emitter_ = new EventEmitter();
    this.bind = this.emitter_.on.bind(this.emitter_);
    this.bindOnce = this.emitter_.once.bind(this.emitter_);
    this.trigger = this.emitter_.emit.bind(this.emitter_);
  }
}

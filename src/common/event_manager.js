/** @module event_manager */

import EventEmitter from 'eventemitter3';

/**
 * Handles events that are fired by GUI elements, using bindings and triggers.
 */
export class EventManager {
  /**
   * Defines the Geona-specific names for useful functions.
   */
  constructor() {
    this._emitter = new EventEmitter();
    this.bind = this._emitter.on.bind(this._emitter);
    this.bindOnce = this._emitter.once.bind(this._emitter);
    this.trigger = this._emitter.emit.bind(this._emitter);
  }
}

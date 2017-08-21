import EventEmitter from 'eventemitter3';

export class EventManager {
  constructor() {
    this.emitter_ = new EventEmitter;
    this.bind = this.emitter_.on;
    this.bindOnce = this.emitter_.once;
    this.trigger = this.emitter_.emit;
  }
}

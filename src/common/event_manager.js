import EventEmitter from 'eventemitter3';

export class EventManager {
  constructor() {
    this.emitter_ = new EventEmitter();
    this.bind = this.emitter_.on.bind(this.emitter_);
    this.bindOnce = this.emitter_.once.bind(this.emitter_);
    this.trigger = this.emitter_.emit.bind(this.emitter_);
  }
}

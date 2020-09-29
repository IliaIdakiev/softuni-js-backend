class EventEmitter {
  constructor() {
    this.subscriptions = {};
  }

  on(eventName, cb) {
    const callback = (data) => cb(data);
    this.subscriptions[eventName] =
      (this.subscriptions[eventName] || []).concat([callback]);
    return () => {
      const index = this.subscriptions[eventName].findIndex(item => item === callback);
      this.subscriptions[eventName].splice(index, 1);
    };
  }

  once(eventName, cb) {
    const unsub = this.on(eventName, (data) => {
      cb(data);
      unsub();
    });
  }

  emit(eventName, data) {
    (this.subscriptions[eventName].slice() || []).forEach(cb => {
      cb(data);
    });
  }
}

const emitter = new EventEmitter();

const unsub1 = emitter.on('some-event', console.log);
// ...
const unsub2 = emitter.on('some-event', console.log);
// ...
setTimeout(() => {
  emitter.emit('some-event', { data: 123 });
  emitter.once('some-event-2', console.log);
  unsub1();
  setTimeout(() => {
    emitter.emit('some-event', { data: 123 });
    emitter.emit('some-event-2', { data: 456 });
    emitter.emit('some-event-2', { data: 456 });
  }, 3000);
}, 1000);
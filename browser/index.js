'use strict';

var emitter = require('./emitter');
var hooks = require('./hooks');

hooks.attach();

module.exports = {
  mount: require('./mount'),
  on: emitter.on.bind(emitter),
  once: emitter.once.bind(emitter),
  off: emitter.off.bind(emitter)
};

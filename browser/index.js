'use strict';

var λ = require('contra');
var state = require('./state');
var emitter = λ.emitter();

state.emitter = emitter;

module.exports = {
  mount: require('./mount'),
  on: emitter.on.bind(emitter),
  once: emitter.once.bind(emitter),
  off: emitter.off.bind(emitter)
};

'use strict';

var λ = require('contra');
var state = require('./state');
var hooks = require('./hooks');
var emitter = λ.emitter();

state.emitter = emitter;

hooks.attach();

module.exports = {
  mount: require('./mount'),
  on: emitter.on.bind(emitter),
  once: emitter.once.bind(emitter),
  off: emitter.off.bind(emitter)
};

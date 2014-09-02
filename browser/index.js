'use strict';

var state = require('./state');
var interceptor = require('./interceptor');
var activator = require('./activator');
var emitter = require('./emitter');
var hooks = require('./hooks');

hooks.attach();

module.exports = {
  mount: require('./mount'),
  partial: require('./partial'),
  on: emitter.on.bind(emitter),
  once: emitter.once.bind(emitter),
  off: emitter.off.bind(emitter),
  intercept: interceptor.intercept,
  navigate: activator.go,
  state: state
};

'use strict';

global.DEBUG && global.DEBUG('[index] loading taunus');

var state = require('./state');
var interceptor = require('./interceptor');
var activator = require('./activator');
var emitter = require('./emitter');
var hooks = require('./hooks');
var view = require('./view');
var mount = require('./mount');
var router = require('./router');
var xhr = require('./xhr');

hooks.attach();

module.exports = global.taunus = {
  mount: mount,
  partial: view.partial,
  on: emitter.on.bind(emitter),
  once: emitter.once.bind(emitter),
  off: emitter.off.bind(emitter),
  intercept: interceptor.add,
  navigate: activator.go,
  state: state,
  route: router,
  xhr: xhr
};

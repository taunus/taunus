'use strict';

global.DEBUG && global.DEBUG('[index] loading taunus');

if (global.taunus !== void 0) {
  throw new Error('Use require(\'taunus/global\') after the initial require(\'taunus\') statement!');
}

var gradual = require('gradual');
var state = require('./state');
var stateClear = require('./stateClear');
var interceptor = require('./interceptor');
var activator = require('./activator');
var emitter = require('./emitter');
var hooks = require('./hooks');
var view = require('./view');
var mount = require('./mount');
var router = require('./router');
var xhr = require('./xhr');
var gc = require('./gc');
var prefetcher = require('./prefetcher');
var redirector = require('./redirector');
var resolve = require('../lib/resolve');
var version = require('../version.json');
var versionCheck = require('./versionCheck');

state.clear = stateClear;
hooks.attach();

function bind (method) {
  return function () {
    return emitter[method].apply(emitter, arguments);
  };
}

module.exports = global.taunus = {
  mount: mount,
  partial: view.partial,
  on: bind('on'),
  once: bind('once'),
  off: bind('off'),
  track: gc.track,
  intercept: interceptor.add,
  navigate: activator.go,
  prefetch: prefetcher.start,
  gradual: gradual,
  state: state,
  route: router,
  resolve: resolve,
  redirect: redirector.redirect,
  xhr: xhr,
  version: version,
  versionCheck: versionCheck
};

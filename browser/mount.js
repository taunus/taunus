'use strict';

var unescape = require('./unescape');
var state = require('./state');
var router = require('./router');
var activator = require('./activator');
var caching = require('./caching');
var w = window;
var mounted;
var booted;

function orEmpty (value) {
  return value || '';
}

function mount (container, wiring, options) {
  var o = options || {};
  if (mounted) {
    throw new Error('Taunus already mounted!');
  }
  mounted = true;

  // handle race condition gracefully.
  if (w.taunusReady && typeof w.taunusReady === 'object') {
    boot(w.taunusReady);
  } else {
    w.taunusReady = boot;
  }

  function boot (model) {
    if (booted) {
      return;
    }
    if (!model) {
      throw new Error('Taunus model must not be falsy!');
    }
    booted = true;
    state.container = container;
    state.controllers = wiring.controllers;
    state.templates = wiring.templates;
    state.routes = wiring.routes;
    state.prefetch = !!options.prefetch;

    router.setup(wiring.routes);

    var url = location.pathname;
    var query = orEmpty(location.search) + orEmpty(location.hash);
    var route = router(url + query);

    state.cache = !!caching.setup(o.cache, route, model);
    activator.start(model);
  }
}

module.exports = mount;

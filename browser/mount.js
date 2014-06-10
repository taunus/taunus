'use strict';

var state = require('./state');
var router = require('./router');
var activator = require('./activator');

function mount (container, wiring) {
  var data = container.dataset.taunus;
  if (!data) {
    throw new Error('taunus: expected data-taunus attribute missing');
  }
  var model = JSON.parse(data);

  state.container = container;
  state.controllers = wiring.controllers;
  state.templates = wiring.templates;
  state.routes = wiring.routes;

  router.setup(wiring.routes);
  activator.start(model);
}

module.exports = mount;

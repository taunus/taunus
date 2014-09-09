'use strict';

var state = require('./state');
var router = require('./router');
var activator = require('./activator');

function mount (container, wiring) {
  var id, elem, model;

  id = container.dataset.taunus;
  elem = document.querySelector('script[data-taunus="' + id + '"]');
  model = JSON.parse(elem.innerText || elem.textContent);

  state.container = container;
  state.controllers = wiring.controllers;
  state.templates = wiring.templates;
  state.routes = wiring.routes;

  router.setup(wiring.routes);
  activator.start(model);
}

module.exports = mount;

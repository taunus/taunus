'use strict';

var state = require('./state');
var router = require('./router');
var activator = require('./activator');
var hooks = require('./hooks');

function mount (container, routes) {
  var data = container.dataset.taunus;
  if (!data) {
    throw new Error('taunus: expected data-taunus attribute missing');
  }
  var model = JSON.parse(data);

  state.container = container;

  hooks.attach();
  router.setup(routes);
  activator.start(model);
}

module.exports = mount;

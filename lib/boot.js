'use strict';

var state = require('./state');
var router = require('./router');
var navigation = require('./navigation');

function boot (container, routes) {
  var data = container.dataset.ponymoo;
  var model = JSON.parse(data);

  state.container = container;

  router.setup(routes);
  navigation.start(model);
}

module.exports = boot;

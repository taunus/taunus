'use strict';

var state = require('./state');
var emitter = require('./emitter');

function partial (container, action, model, route) {
  var template = state.templates[action];
  var controller = state.controllers[action];
  container.innerHTML = template(model);
  emitter.emit('render', container, model);
  if (controller) {
    controller(model, route);
  }
}

module.exports = partial;

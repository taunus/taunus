'use strict';

var state = require('./state');
var emitter = require('./emitter');

function partial (container, action, model) {
  var template = state.templates[action];
  var controller = state.controllers[action];
  container.innerHTML = template(model);
  emitter.emit('render', container, model);
  if (controller) {
    controller(model);
  }
}

module.exports = partial;

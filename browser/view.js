'use strict';

var state = require('./state');
var emitter = require('./emitter');

function view (container, enforcedAction, model, route, options) {
  var action = enforcedAction || model && model.action || route && route.action;
  var controller = state.controllers[action];
  var internals = options || {};
  if (internals.render !== false) {
    container.innerHTML = render(action, model);
  }
  emitter.emit('render', container, model, route || null);
  if (controller) {
    controller(model, container, route || null);
  }
}

function render (action, model) {
  var template = state.templates[action];
  try {
    return template(model);
  } catch (e) {
    throw new Error('Error rendering "' + action + '" view template\n' + e.stack);
  }
}

function partial (container, action, model) {
  return view(container, action, model, null, { routed: false });
}

view.partial = partial;

module.exports = view;

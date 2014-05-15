'use strict';

var state = require('./state');

function partial (container, template, controller, model) {
  container.innerHTML = template(model);
  state.emit('render', container, model);
  controller(model);
}

module.exports = partial;

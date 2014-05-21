'use strict';

var emitter = require('./emitter');

function partial (container, template, controller, model) {
  container.innerHTML = template(model);
  emitter.emit('render', container, model);
  controller(model);
}

module.exports = partial;

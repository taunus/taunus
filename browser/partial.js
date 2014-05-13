'use strict';

var links = require('./links');

function partial (container, template, controller, model) {
  container.innerHTML = template(model);
  links(container);
  controller(model);
}

module.exports = partial;

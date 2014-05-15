'use strict';

var state = require('./state');
var links = require('./links');

function attach () {
  state.emitter.on('render', link);
}

function link (container, model) {
  links(container);
}

module.exports = {
  attach: attach
};

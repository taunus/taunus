'use strict';

var state = require('./state');
var links = require('./links');

function attach () {
  state.emitter.on('render', link);
}

function link (root, model) {
  console.log(root, model);
  links(root);
}

module.exports = {
  attach: attach
};

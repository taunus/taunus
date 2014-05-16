'use strict';

var state = require('./state');
var links = require('./links');

function attach () {
  state.emitter.on('start', links);
}

module.exports = {
  attach: attach
};

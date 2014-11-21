'use strict';

function DEBUG () {
  console.log.apply(console, arguments);
}

global.DEBUG = DEBUG;

var taunus = require('./');

module.exports = taunus;

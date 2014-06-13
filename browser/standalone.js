'use strict';

var wiring = require('embedded-wiring');
var taunus = require('./');

taunus.wiring = wiring;
module.exports = taunus;

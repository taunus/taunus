'use strict';

var λ = require('contra');
var ponymoo = λ.emitter({
  boot: require('./lib/boot')
});

module.exports = ponymoo;

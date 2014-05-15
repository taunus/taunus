'use strict';

var λ = require('contra');
var state = require('./state');
var taunus = λ.emitter({
  mount: require('./mount')
});

module.exports = state.emitter = taunus;

'use strict';

var state = require('./state');
var deferred = require('../lib/deferred');

function needs (action) {
  var demands = [];
  var is = deferred(action, state.deferrals);
  if (is) {
    if (invalid(state.templates)) {
      demands.push('template');
    }
    if (invalid(state.controllers)) {
      demands.push('controller');
    }
  }

  function invalid (store) {
    return !(action in store) || store[action].version !== state.version;
  }

  return demands;
}

module.exports = {
  needs: needs
};

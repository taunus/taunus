'use strict';

var state = require('./state');
var deferred = require('../lib/deferred');

function needs (action) {
  var demands = [];
  var is = deferred(action, state.deferrals);
  if (is) {
    if (invalid('templates')) {
      demands.push('template');
    }
    if (invalid('controllers')) {
      demands.push('controller');
    }
  }

  function invalid (type) {
    var store = state[type];
    var fail = !store[action] || !store[action][state.version];
    if (fail) {
      global.DEBUG && global.DEBUG('[deferral] deferred %s %s not found', action, type.substr(0, type.length - 1));
    }
    return !!fail;
  }

  return demands;
}

module.exports = {
  needs: needs
};

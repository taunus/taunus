'use strict';

var state = require('./state');
var caching = require('./caching');
var idb = require('./stores/idb');

function set (action, data) {
  store('template');
  store('controller');

  function store (key) {
    var type = key + 's';

    if (key in data) {
      push(type, action, data[key], data.version);
    }
  }
}

function refill () {
  caching.ready(pullComponents);
}

function pullComponents (enabled) {
  if (!enabled) { // bail if caching is turned off
    return;
  }
  idb.get('controllers', pull.bind(null, 'controllers'));
  idb.get('templates', pull.bind(null, 'templates'));
}

function pull (type, err, items) {
  if (err) {
    return;
  }
  items.forEach(pullItem);

  function pullItem (item) {
    push(type, item.key, item.data, item.version);
  }
}

function push (type, action, value, version) {
  if (version === state.version) {
    state[type][action] = parse(value);
  }
}

function parse (value) { // empty string can have properties and is also falsy
  /* jshint evil:true */
  return value ? eval(value) : '';
}

module.exports = {
  set: set,
  refill: refill
};

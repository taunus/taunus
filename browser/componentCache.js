'use strict';

var state = require('./state');
var caching = require('./caching');
var unstrictEval = require('./unstrictEval');
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
    global.DEBUG && global.DEBUG('[componentCache] pulling %s for %s', type, item.key);
    push(type, item.key, item.data, item.version);
  }
}

function push (type, action, value, version) {
  var singular = type.substr(0, type.length - 1);
  if (version === state.version) {
    global.DEBUG && global.DEBUG('[componentCache] storing %s for %s in state', singular, action);
    state[type][action] = parse(singular, value);
    window[singular]= state[type][action];
  } else {
    global.DEBUG && global.DEBUG('[componentCache] bad version: %s !== %s', version, state.version);
  }
}

function parse (type, value) {
  /* jshint evil:true */
  if (value) {
    try {
      return unstrictEval(value);
    } catch (e) {
      global.DEBUG && global.DEBUG('[componentCache] %s eval failed', type, e);
      return '';
    }
  }
  return ''; // empty string can have properties and is also falsy
}

module.exports = {
  set: set,
  refill: refill
};

'use strict';

var state = require('./state');
var raw = require('./stores/raw');
var idb = require('./stores/idb');

function clear () {
  raw.clear();
  idb.clear('models');
  idb.clear('controllers');
  idb.clear('templates');
  clearStore('controllers');
  clearStore('templates');
}

function clearStore (type) {
  var store = state[type];
  Object.keys(store).filter(o).forEach(rm);

  function o (action) {
    return store[action] && typeof store[action] === 'object';
  }
  function rm (action) {
    delete store[action];
  }
}


module.exports = clear;

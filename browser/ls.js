'use strict';

var ls = global.localStorage;
var enabled = test();

function test () {
  var key = 'local-storage-feature-detection';
  try {
    ls.setItem(key, key);
    ls.removeItem(key);
    return true;
  } catch(e) {
    return false;
  }
}

function get (key) {
  return JSON.parse(ls.getItem(key));
}

function set (key, value) {
  ls.setItem(key, JSON.stringify(value));
}

module.exports = {
  set: enabled ? set : noop,
  get: enabled ? get : noop
};

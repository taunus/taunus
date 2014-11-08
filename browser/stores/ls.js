'use strict';

var ls = global.localStorage;
var enabled = test();
var prefix = 'taunus:/';

function noop () {}

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

function get (key, done) {
  done(null, JSON.parse(ls.getItem(prefix + key)));
}

function set (key, value, done) {
  ls.setItem(prefix + key, JSON.stringify(value));
  (done || noop)(null);
}

module.exports = {
  name: enabled ? 'nullStorage' : 'localStorage',
  get: enabled ? get : noop,
  set: enabled ? set : noop
};

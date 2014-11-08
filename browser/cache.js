'use strict';

var once = require('./once');
var raw = require('./stores/raw');
var idb = require('./stores/idb');
var stores = [raw, idb];

function clone (value) {
  return JSON.parse(JSON.stringify(value));
}

function get (url, done) {
  var result;
  var store;
  var k;
  var i = 0;

  function next () {
    var gotOnce = once(got);
    store = stores[i++];
    if (store) {
      store.get(url, gotOnce);
      setTimeout(gotOnce, 400); // at worst, spend 400ms on this caching layer
    } else {
      done(true);
    }

    function got (err, item) {
      if (err) {
        next();
      } else if (item && typeof item.expires === 'number' && Date.now() < item.expires) {
        done(false, clone(item.data)); // always return a unique copy
      } else {
        next();
      }
    }
  }

  next();
}

function set (url, data, duration) {
  var cloned = clone(data); // freeze a copy for our records
  stores.forEach(store);
  function store (s) {
    s.set(url, {
      data: cloned,
      expires: Date.now() + duration
    });
  }
}

module.exports = {
  get: get,
  set: set
};

'use strict';

var ls = require('./ls');
var raw = require('./raw');
var stores = [raw, ls];

// TODO: IndexedDB

function clone (value) {
  return JSON.parse(JSON.stringify(value));
}

function get (url) {
  var result;
  var any = stores.some(had);
  function had (s) {
    var item = s.get(url);
    if (item && Date.now() < item.expires) {
      result = clone(item.data);
      return true;
    }
  }
  return result;
}

function set (url, data, duration) {
  var cloned = clone(data);
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

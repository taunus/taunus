'use strict';

var ls = require('./ls');
var api = {};
var g = global;
var idb = g.indexedDB || g.mozIndexedDB || g.webkitIndexedDB || g.msIndexedDB;
var supports;
var db;
var name = 'taunus-cache';
var store = 'view-models';
var keyPath = 'url';
var setQueue = [];

function noop () {}

function test () {
  var name = 'indexed-db-feature-detection';
  var success;
  var req;
  var db;

  if (!(idb && 'deleteDatabase' in idb)) {
    supports = false; return;
  }

  try {
    idb.deleteDatabase(name).onsuccess = transactionalTest;
  } catch (e) {
    supports = false;
  }

  function transactionalTest () {
    req = idb.open(name, 1);
    req.onupgradeneeded = upgneeded;
    req.onsuccess = success;

    function upgneeded () {
      req.result.createObjectStore('store');
    }

    function success () {
      db = req.result;
      try {
        db.transaction('store', 'readwrite').objectStore('store').add(new Blob(), 'key');
      } finally {
        db.close();
        idb.deleteDatabase(name);
        if (success) {
          open();
        } else {
          supports = false;
        }
      }
    }
  }
}

function open () {
  var req = idb.open(name, 1);
  req.onerror = fallback;
  req.onupgradeneeded = upgneeded;
  req.onsuccess = success;

  function upgneeded () {
    req.result.createObjectStore(store, { keyPath: keyPath });
  }

  function success () {
    db = req.result;
    drainQueue();
    api.name = 'IndexedDB';
    api.get = get;
    api.set = set;
  }
}

function fallback () {
  api.name = ls.name;
  api.get = ls.get;
  api.set = enqueueSet;
}

function enqueueSet (key, value, done) {
  if (supports !== false) {
    setQueue.push({ key: key, value: value, done: done });
  }
  ls.set(key, value, done);
}

function drainQueue () {
  while (setQueue.length) {
    var item = setQueue.shift();
    set(item.key, item.value, item.done);
  }
}

function query (op, value, done) {
  var req = db.transaction(store, 'readwrite').objectStore(store)[op](value);

  req.onsuccess = success;
  req.onerror = error;

  function success () {
    (done || noop)(null, req.result);
  }

  function error () {
    (done || noop)(new Error('Taunus cache query failed at IndexedDB!'));
  }
}

function get (key, done) {
  query('get', key, done);
}

function set (key, value, done) {
  value[keyPath] = key;
  query('add', value, done); // attempt to insert
  query('put', value, done); // attempt to update
}

fallback();
test();

module.exports = api;

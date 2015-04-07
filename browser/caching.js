'use strict';

var cache = require('./cache');
var idb = require('./stores/idb');
var state = require('./state');
var emitter = require('./emitter');
var interceptor = require('./interceptor');
var defaults = 15;
var baseline;

function e (value) {
  return value || '';
}

function setup (duration, route) {
  baseline = parseDuration(duration);
  if (baseline < 1) {
    state.cache = false;
    return;
  }
  interceptor.add(intercept);
  emitter.on('fetch.done', persist);
  state.cache = true;
}

function intercept (e) {
  global.DEBUG && global.DEBUG('[cache] attempting to intercept %s', e.route.url);
  cache.get('models', e.route.path, result);

  function result (err, data) {
    global.DEBUG && global.DEBUG('[cache] interception for %s %s', e.route.url, err || !data ? 'failed' : 'succeeded');
    if (!err && data) {
      e.preventDefault(data);
    }
  }
}

function parseDuration (value) {
  if (value === true) {
    return baseline || defaults;
  }
  if (typeof value === 'number') {
    return value;
  }
  return 0;
}

function persist (route, context, data) {
  if (!state.cache) {
    return;
  }
  if (route.cache === false) {
    return;
  }
  var d = baseline;
  if (typeof route.cache === 'number') {
    d = route.cache;
  }
  var target = context.hijacker || route.action;
  var freshness = parseDuration(d) * 1000;
  if ('model' in data) {
    global.DEBUG && global.DEBUG('[cache] saving model for %s', route.path);
    cache.set('models', route.path, data.model, freshness, data.version);
  }
  if ('template' in data) {
    global.DEBUG && global.DEBUG('[cache] saving template for %s', target);
    cache.set('templates', target, data.template, Infinity);
  }
  if ('controller' in data) {
    global.DEBUG && global.DEBUG('[cache] saving controller for %s', target);
    cache.set('controllers', target, data.controller, Infinity);
  }
}

function ready (fn) {
  if (state.cache) {
    idb.tested(fn); // wait on idb compatibility tests
  } else {
    fn(false); // caching is a no-op
  }
}

module.exports = {
  setup: setup,
  persist: persist,
  ready: ready
};

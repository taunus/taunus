'use strict';

var xhr = require('./xhr');
var emitter = require('./emitter');
var interceptor = require('./interceptor');
var lastXhr = {};

function e (value) {
  return value || '';
}

function jsonify (route) {
  var parts = route.parts;
  var qs = e(parts.search);
  var p = qs ? '&' : '?';
  return parts.pathname + qs + p + 'json' + e(parts.hash);
}

function abort (source) {
  if (lastXhr[source]) {
    lastXhr[source].abort();
  }
}

function abortPending () {
  Object.keys(lastXhr).forEach(abort);
  lastXhr = {};
}

function fetcher (source, route, context, done) {
  var url = route.url;
  if (lastXhr[source]) {
    emitter.emit('fetch.abort', route);
    lastXhr[source].abort();
    lastXhr[source] = null;
  }
  interceptor.execute(route, afterInterceptors);

  function afterInterceptors (err, result) {
    if (!err && result.defaultPrevented) {
      done(null, result.model);
    } else {
      emitter.emit('fetch.start', route);
      lastXhr[source] = xhr(jsonify(route), notify);
    }
  }

  function notify (err, data) {
    if (err) {
      emitter.emit('fetch.error', err, { source: 'xhr', context: context });
    } else {
      emitter.emit('fetch.done', route, data);
    }
    done(err, data);
  }
}

fetcher.abortPending = abortPending;

module.exports = fetcher;

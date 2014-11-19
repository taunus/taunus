'use strict';

var xhr = require('./xhr');
var state = require('./state');
var emitter = require('./emitter');
var interceptor = require('./interceptor');
var deferred = require('../lib/deferred');
var lastXhr = {};

function e (value) {
  return value || '';
}

function negotiate (route, done) {
  var parts = route.parts;
  var qs = e(parts.search);
  var p = qs ? '&' : '?';
  var demands = ['json'];
  var is = deferred(route.action, state.deferrals);
  if (is === false) {
    end();
  } else { // if !cached.. demand it
    demands.push('view');
    demands.push('controller');
    end();
  }
  function end () {
    done(parts.pathname + qs + p + demands.join('&'));
  }
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

function fetcher (route, context, done) {
  var url = route.url;
  if (lastXhr[context.source]) {
    lastXhr[context.source].abort();
    lastXhr[context.source] = null;
  }
  interceptor.execute(route, afterInterceptors);

  function afterInterceptors (err, result) {
    if (!err && result.defaultPrevented) {
      done(null, result.model);
    } else {
      emitter.emit('fetch.start', route, context);
      negotiate(route, negotiated);
    }
  }

  function negotiated (url) {
    lastXhr[context.source] = xhr(url, notify);
  }

  function notify (err, data) {
    if (err) {
      if (err.message === 'aborted') {
        emitter.emit('fetch.abort', route, context);
      } else {
        emitter.emit('fetch.error', route, context, err);
      }
    } else {
      if (data && data.version) {
        state.version = data.version; // sync version expectation with server-side
      }
      emitter.emit('fetch.done', route, context, data);
    }
    done(err, data);
  }
}

fetcher.abortPending = abortPending;

module.exports = fetcher;

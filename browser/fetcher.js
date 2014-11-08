'use strict';

var xhr = require('./xhr');
var emitter = require('./emitter');
var interceptor = require('./interceptor');
var lastXhr;

function e (value) {
  return value || '';
}

function jsonify (route) {
  var parts = route.parts;
  var qs = e(parts.search);
  var p = qs ? '&' : '?';
  return parts.pathname + qs + p + 'json' + e(parts.hash);
}

module.exports = function (route, context, done) {
  var url = route.url;
  if (lastXhr) {
    emitter.emit('fetch.abort', route);
    lastXhr.abort();
  }
  var intercepted = interceptor.execute(route);
  if (intercepted.defaultPrevented) {
    done(intercepted.model);
  } else {
    emitter.emit('fetch.start', route);
    lastXhr = xhr(jsonify(route), context, notify);
  }

  function notify (data) {
    emitter.emit('fetch.done', route, data);
    done.apply(null, arguments);
  }
};

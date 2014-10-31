'use strict';

var lastXhr;
var xhr = require('./xhr');
var emitter = require('./emitter');
var interceptor = require('./interceptor');

module.exports = function (url, context, done) {
  var intercepted = interceptor.intercept(url);
  if (intercepted !== void 0) {
    done(intercepted);
  } else {
    if (lastXhr) {
      emitter.emit('fetch.abort');
      lastXhr.abort();
    }
    emitter.emit('fetch.start');
    lastXhr = xhr(url, context, cleanup);
  }

  function cleanup (err) {
    emitter.emit('fetch.done');
    done.apply(null, arguments);
  }
};

'use strict';

var lastXhr;
var xhr = require('./xhr');
var interceptor = require('./interceptor');

module.exports = function (url, context, done) {
  var intercepted = interceptor.intercept(url);
  if (intercepted !== void 0) {
    done(intercepted);
  } else {
    if (lastXhr) {
      lastXhr.abort();
    }
    lastXhr = xhr(url, context, done);
  }
};

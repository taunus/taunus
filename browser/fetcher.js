'use strict';

var xhr = require('./xhr');
var interceptor = require('./interceptor');

module.exports = function (url, done) {
  var intercepted = interceptor.intercept(url, done);
  if (intercepted !== void 0) {
    done(intercepted);
  } else {
    xhr(url, done);
  }
};

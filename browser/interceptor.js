'use strict';

var router = require('./router');
var interceptors = {};

module.exports = {
  on: function (action, fn) {
    interceptors[action] = fn;
  },
  intercept: function (url, done) {
    var route = router(url);
    var interceptor = interceptors[route.action];
    if (interceptor) {
      return interceptor(route.params);
    }
  }
};

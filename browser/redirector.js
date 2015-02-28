'use strict';

var location = require('./global/location');

function redirect (options) {
  var activator = require('./activator');
  if (options.hard === true) {
    global.DEBUG && global.DEBUG('[redirector] hard, to', options.href);
    location.href = options.href; // hard redirects are safer but slower
  } else {
    global.DEBUG && global.DEBUG('[redirector] soft, to', options.href);
    activator.go(options.href); // soft redirects are faster but may break expectations
  }
}

module.exports = {
  redirect: redirect
};

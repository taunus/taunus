'use strict';

var location = require('./global/location');
var hardRedirect = require('./hardRedirect');

function redirect (options) {
  var activator = require('./activator');
  var o = options || {};
  if (o.hard === true) { // hard redirects are safer but slower
    global.DEBUG && global.DEBUG('[redirector] hard, to', o.href);
    hardRedirect(o.href);
  } else { // soft redirects are faster but may break expectations
    global.DEBUG && global.DEBUG('[redirector] soft, to', o.href);
    activator.go(o.href, { force: o.force === true, wet: o.wet === true });
  }
}

module.exports = {
  redirect: redirect
};

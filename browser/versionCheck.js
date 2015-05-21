'use strict';

var state = require('./state');
var hardRedirect = require('./hardRedirect');
var location = require('./global/location');

function versionCheck (version, href) {
  var match = version === state.version;
  if (match === false) {
    global.DEBUG && global.DEBUG('[activator] version change (is "%s", was "%s"), redirecting to %s', version, state.version, href);
    hardRedirect(href || location.href); // version change demands fallback to strict navigation
  }
  return match;
}

module.exports = versionCheck;

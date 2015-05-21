'use strict';

var state = require('./state');
var hardRedirect = require('./hardRedirect');

function versionCheck (version, href) {
  var match = data.version === state.version;
  if (match === false) {
    global.DEBUG && global.DEBUG('[activator] version change (is "%s", was "%s"), redirecting to %s', data.version, state.version, url);
    hardRedirect(href || location.href); // version change demands fallback to strict navigation
  }
  return match;
}

module.exports = versionCheck;

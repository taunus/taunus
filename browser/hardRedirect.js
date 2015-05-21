'use strict';

var state = require('./state');
var location = require('./global/location');

function hardRedirect (href) {
  location.href = href;
  state.redirecting = true;
}

module.exports = hardRedirect;

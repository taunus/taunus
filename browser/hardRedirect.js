'use strict';

var state = require('./state');

function hardRedirect (href) {
  location.href = href;
  state.redirecting = true;
}

module.exports = hardRedirect;

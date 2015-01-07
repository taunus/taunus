'use strict';

var render = require('./render');

function noop () {}

module.exports = function (req, res, url) {
  render({}, { redirectTo: url }, req, res, noop);
};

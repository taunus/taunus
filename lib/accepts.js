'use strict';

var accepts = require('accepts');

module.exports = function (req) {
  return accepts(req).type(['html', 'json']);
};

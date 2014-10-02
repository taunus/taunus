'use strict';

var _ = require('lodash');
var path = require('path');
var accepts = require('./accepts');
var resolvers = require('./resolvers');
var rc = require('./rc');
var render = require('./render');

module.exports = function (defaultAction, req, res, next) {
  render(defaultAction, res.viewModel, req, res, next);
};

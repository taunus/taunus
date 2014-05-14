'use strict';

var _ = require('lodash');
var path = require('path');
var rc = require('./rc');
var cwd = process.cwd();

module.exports = function (req, res, next) {
  var vm = res.viewModel;
  var accept = req.headers.accept || '';
  var data = _.extend({}, rc.defaults, vm);
  var template;

  if (!data) {
    next();
  } else if (~accept.indexOf('html')) {
    template = path.join(cwd, rc.views, res.partial);
    data.partial = require(template)(data.model);
    res.render(rc.layout, data);
  } else if (~accept.indexOf('json')) {
    res.json(data);
  } else {
    next();
  }
};

'use strict';

var _ = require('lodash');
var path = require('path');
var resolvers = require('./resolvers');
var rc = require('./rc');
var cwd = process.cwd();

module.exports = function (action, req, res, next) {
  var vm = res.viewModel;
  var accept = req.headers.accept || '';
  var data = _.extend({}, rc.defaults, vm);
  var location;
  var template;

  if (!data) {
    next();
  } else if (~accept.indexOf('html')) {
    location = resolvers.getViewTemplatePath(action);
    template = require(location);
    data.partial = template(data.model);
    res.render(rc.layout, data);
  } else if (~accept.indexOf('json')) {
    res.json(data);
  } else {
    next();
  }
};

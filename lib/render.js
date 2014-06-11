'use strict';

var _ = require('lodash');
var path = require('path');
var accepts = require('./accepts');
var resolvers = require('./resolvers');
var rc = require('./rc');
var cwd = process.cwd();

module.exports = function (action, req, res, next) {
  var vm = res.viewModel;
  var data = _.extend({}, rc.defaults, vm);
  var accept = accepts(req, ['html', 'json']);
  var location;
  var template;

  // TODO allow viewModel to override the view template.
  // res.viewModel.action, or something akin

  if (accept.html) {
    location = resolvers.getViewTemplatePath(action);
    template = require(location);
    data.partial = template(data.model);
    res.render(rc.layout, data);
  } else if (accept.json) {
    res.json(data);
  } else {
    next();
  }
};

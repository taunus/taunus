'use strict';

var _ = require('lodash');
var path = require('path');
var accepts = require('./accepts');
var resolvers = require('./resolvers');
var rc = require('./rc');
var cwd = process.cwd();

module.exports = function (defaultAction, req, res, next) {
  var vm = res.viewModel;
  var data = _.extend({}, rc.defaults, vm);
  var accept = accepts(req, ['html', 'json']);
  var location;
  var relative;
  var template;

  data.model = data.model || {};
  var action = data.model.action || defaultAction;

  if (req.flash) {
    data.model.flash = req.flash();
  }

  if (req.user) {
    data.model.user = req.user;
  }

  if (accept.html) {
    location = resolvers.getViewTemplatePath(action);
    relative = path.relative(__dirname, location);
    template = require(location);
    data.partial = template(data.model);
    res.render(rc.layout, data);
  } else if (accept.json) {
    res.json(data);
  } else {
    next();
  }
};

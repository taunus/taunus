'use strict';

var _ = require('lodash');
var path = require('path');
var accepts = require('./accepts');
var resolvers = require('./resolvers');
var rc = require('./rc');

function layout (fn, model, res, next) {
  try {
    res.send(fn(model));
  } catch (err) {
    next(err);
  }
}

module.exports = function (defaultAction, vm, req, res, next) {
  var data = _.merge({}, res.defaultViewModel, rc.defaults, vm);
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
    layout(rc.layout, data, res, next);
  } else if (accept.json) {
    res.json(data);
  } else {
    next();
  }
};

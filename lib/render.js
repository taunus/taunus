'use strict';

var _ = require('lodash');
var path = require('path');
var crypto = require('crypto');
var accepts = require('./accepts');
var resolvers = require('./resolvers');
var state = require('./state');
var rc = require('./rc');

function layout (fn, data, res, next) {
  try {
    res.send(fn(data));
  } catch (err) {
    next(err);
  }
}

function md5 (value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

module.exports = function (defaultAction, vm, req, res, next) {
  var data = _.merge({}, state.defaults, vm);
  var accept = accepts(req, ['html', 'json']);
  var location;
  var relative;
  var template;

  if (data.skip) {
    next(); return;
  }

  data.model = data.model || {};
  var action = data.model.action || defaultAction;

  if (req.flash) {
    data.model.flash = req.flash();
  }

  if (req.user) {
    data.model.user = req.user;
  }

  if (data.statusCode) {
    res.status(data.statusCode);
    delete data.statusCode;
  }

  if (accept.html) {
    headers();
    location = resolvers.getViewTemplatePath(action);
    relative = path.relative(__dirname, location);
    template = require(location);
    data.partial = template(data.model);
    layout(rc.layout, data, res, next);
  } else if (accept.json) {
    headers();
    res.json(data);
  } else {
    next();
  }

  function headers () {
    var age = 31536000;
    var etag = md5(JSON.stringify(data.model));

    res.set('Vary', 'Accept');
    res.set('ETag', etag);
    res.set('cache-control', 'public, max-age=' + age);
  }
};

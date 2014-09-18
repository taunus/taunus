'use strict';

var path = require('path');
var renderware = require('./renderware');
var resolvers = require('./resolvers');
var shared = require('./resolvers.shared');
var defaults = require('./resolvers.server');
var rc = require('./rc');

module.exports = function (app, routes, o) {
  resolvers.use(shared);
  resolvers.use(defaults);

  var opts = o || {};
  if (opts.resolvers) {
    resolvers.use(opts.resolvers);
  }

  rc.layout = opts.layout;
  routes.forEach(register);

  function parseRouteMiddleware (middleware) {
    if (Array.isArray(middleware)) {
      return middleware;
    }
    if (typeof middleware === 'function') {
      return [middleware];
    }
    return [];
  }

  function getDefaultModel (req, res, next) {
    if (opts.defaultRequestModel) {
      opts.defaultRequestModel(req, assign);
    } else {
      assign(null, {});
    }

    function assign (err, data) {
      res.defaultViewModel = !err && data || {};
      next(err);
    }
  }

  function register (route) {
    var middleware = parseRouteMiddleware(route.middleware);
    var args = [route.route, getDefaultModel].concat(middleware);
    var location = resolvers.getControllerActionPath(route.action);
    var relative = path.relative(__dirname, location);
    var action = require(relative);
    var renderer = renderware.bind(null, route.action);

    args.push(action, renderer);
    app.get.apply(app, args);
  }
};

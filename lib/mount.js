'use strict';

var render = require('./render');
var resolvers = require('./resolvers');
var shared = require('./resolvers.shared');
var defaults = require('./resolvers.server');

module.exports = function (app, routes, opts) {
  resolvers.use(shared);
  resolvers.use(defaults);

  var options = opts || {};
  if (options.resolvers) {
    resolvers.use(options.resolvers);
  }

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

  function register (route) {
    var middleware = parseRouteMiddleware(route.middleware);
    var args = [route.route].concat(middleware);
    var location = resolvers.getControllerActionPath(route.action);
    var action = require(location);
    var renderer = render.bind(null, route.action);

    args.push(action, renderer);
    app.get.apply(app, args);
  }
};

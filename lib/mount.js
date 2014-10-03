'use strict';

var path = require('path');
var renderware = require('./renderware');
var resolvers = require('./resolvers');
var shared = require('./resolvers.shared');
var defaults = require('./resolvers.server');
var state = require('./state');
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
  opts.getDefaultViewModel(saveDefaultModel);

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
    if (route.ignore) {
      return;
    }
    var middleware = parseRouteMiddleware(route.middleware);
    var args = [route.route].concat(middleware);
    var location = resolvers.getControllerActionPath(route.action);
    var relative = path.relative(__dirname, location);
    var action = require(relative);
    var renderer = renderware.bind(null, route.action);

    args.push(action, renderer);
    app.get.apply(app, args);
  }

  function saveDefaultModel (err, data) {
    if (err) {
      throw err;
    }
    state.defaults = data;
  }
};

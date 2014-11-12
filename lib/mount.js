'use strict';

var path = require('path');
var resolvers = require('./resolvers');
var shared = require('./resolvers.shared');
var defaults = require('./resolvers.server');
var optionalRequire = require('./optionalRequire');
var state = require('./state');
var rc = require('./rc');

module.exports = function mount (addRoute, options) {
  resolvers.use(shared);
  resolvers.use(defaults);

  var o = options || {};
  if (o.resolvers) {
    resolvers.use(o.resolvers);
  }

  state.plaintext = o.plaintext;

  rc.layout = o.layout;
  o.routes.forEach(register);

  mount.rebuildDefaultViewModel = rebuild;
  mount.rebuildDefaultViewModel();

  function rebuild () {
    if (o.getDefaultViewModel) {
      o.getDefaultViewModel(saveDefaultModel);
    } else {
      saveDefaultModel(null, {});
    }
  }

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
    var location = resolvers.getControllerActionPath(route.action);
    var relative = path.relative(__dirname, location);
    var action = optionalRequire(relative);
    if (action === null) {
      console.warn('Missing server-side controller for "%s" action. Searched location: "%s"', route.action, location);
    }

    addRoute({
      route: route.route,
      action: route.action,
      actionFn: action,
      middleware: middleware
    });
  }

  function saveDefaultModel (err, data) {
    if (err) {
      throw err;
    }
    state.defaults = data;
    state.emit('defaults');
  }
};

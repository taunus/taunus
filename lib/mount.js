'use strict';

var path = require('path');
var render = require('./render');
var rc = require('./rc');
var cwd = process.cwd();

module.exports = function (app, routes) {

  routes.forEach(register);

  function register (route) {
    var middleware = [route.route].concat(route.middleware || []);
    var location = path.join(cwd, rc.server_controllers, route.action);
    var action = require(location);
    var renderer = render.bind(null, route.action);

    middleware.push(action, renderer);
    app.get.apply(app, middleware);
  }
};

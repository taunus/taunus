'use strict';

var path = require('path');
var render = require('./render');
var rc = require('./rc');
var cwd = process.cwd();

module.exports = function (app, routes) {
  var renderer = render();

  routes.forEach(register);

  function register (route) {
    var middleware = [route.route].concat(route.middleware || []);
    var controllerAction = route.action.split('/');
    var controllerName = path.join(cwd, rc.controllers, controllerAction[0]);
    var actionName = controllerAction[1];
    var action = require(controllerName)[actionName];

    middleware.push(augment, action, renderer);
    app.get.apply(app, middleware);

    function augment (req, res, next) {
      res.partial = route.action;
      next();
    }
  }
};

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var rc = require('./rc');
var cwd = process.cwd();

function render (force) {
  var location = path.resolve(cwd, rc.server_routes);
  if (force) {
    delete require.cache[location];
  }
  var routes = require(location);
  return template(routes);
}

function template (routes) {
  var buffer = [];
  var first = true;

  put('module.exports = [');
  routes.forEach(partial);
  put('];\n');

  function partial (route) {
    var open = first ? '{\n' : ', {\n';
    put(open);
    put('  route: "%s",\n', route.route);
    put('  template: require("%s"),\n', getTemplatePath(route));
    put('  controller: require("%s")\n', getControllerPath(route));
    put('}');
    first = false;
  }

  function put () {
    var value = util.format.apply(util, arguments);
    buffer.push(value);
  }

  return buffer.join('');
}

function getTemplatePath (route) {
  var absolute = path.resolve(rc.views, route.action);
  return relative(absolute);
}

function getControllerPath (route) {
  var absolute = path.resolve(rc.client_controllers, route.action);
  return relative(absolute);
}

function relative (to) {
  var base = path.dirname(rc.client_routes);
  return path.relative(base, to);
}

module.exports = {
  render: render
};

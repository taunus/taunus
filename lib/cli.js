'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var rc = require('./rc');
var resolvers = require('./resolvers');
var shared = require('./resolvers.shared');
var defaults = require('./resolvers.cli');

resolvers.use(shared);
resolvers.use(defaults);

function render (force, replacements) {
  if (replacements) {
    resolvers.use(replacements);
  }
  var location = path.resolve(rc.server_routes);
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
  var location = resolvers.getViewTemplatePath(route.action);
  return cross(relative(location));
}

function getControllerPath (route) {
  var location = resolvers.getViewControllerPath(route.action);
  return cross(relative(location));
}

function relative (to) {
  var base = path.dirname(rc.client_routes);
  return path.relative(base, to);
}

// writing to a file will turn '\\' into '\'
// this function fixes the issue on Windows
function cross (path) {
  return path.replace(/\\/g, '\\\\');
}

module.exports = {
  render: render
};

'use strict';

var fs = require('fs');
var glob = require('glob');
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
  return compose(routes);
}

function compose (routes) {
  var buffer = [];
  var templates = glob.sync(path.join(rc.views, '**/*.js'));
  var controllers = glob.sync(path.join(rc.client_controllers, '**/*.js'));
  var first;

  put('"use strict";\n\n');

  first = true;
  put('var templates = {');
  templates.forEach(template);
  put('\n};\n\n')

  first = true;
  put('var controllers = {');
  controllers.forEach(controller);
  put('\n};\n\n')

  first = true;
  put('var routes = {');
  routes.forEach(route);
  put('\n};\n\n')

  put('module.exports = {\n');
  put('  templates: templates,\n');
  put('  controllers: controllers,\n');
  put('  routes: routes\n');
  put('};\n');

  function template (data) {
    var relative = path.relative(rc.views, data);
    var open = first ? '\n' : ',\n';
    put(open);
    put('  "%s": require("%s")', getTemplateName(relative), getTemplatePath(relative));
    first = false;
  }

  function controller (data) {
    var relative = path.relative(rc.client_controllers, data);
    var open = first ? '\n' : ',\n';
    put(open);
    put('  "%s": require("%s")', getTemplateName(relative), getControllerPath(relative));
    first = false;
  }

  function route (data) {
    var open = first ? '\n' : ',\n';
    put(open);
    put('  "%s": "%s"', data.route, data.action);
    first = false;
  }

  function put () {
    var value = util.format.apply(util, arguments);
    buffer.push(value);
  }

  return buffer.join('').replace(/"/g, '\'');
}

function getTemplateName (action) {
  return action.replace(/\.js$/, '');
}

function getTemplatePath (action) {
  var location = resolvers.getViewTemplatePath(action);
  return cross(relative(location));
}

function getControllerPath (action) {
  var location = resolvers.getViewControllerPath(action);
  return cross(relative(location));
}

function relative (to) {
  var base = path.dirname(rc.client_wiring);
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

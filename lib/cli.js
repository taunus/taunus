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

function render (force, replacements, transform) {
  if (replacements) {
    resolvers.use(replacements);
  }
  var location = path.resolve(rc.server_routes);
  if (force) {
    delete require.cache[location];
  }
  var routes = require(location);
  return compose(routes, transform);
}

function compose (routes, transform) {
  var buffer = [];
  var templates = glob.sync(path.join(rc.views, '**/*.js'));
  var controllers = glob.sync(path.join(rc.client_controllers, '**/*.js'));
  var first;

  put('"use strict";\n\n');

  first = true;
  put('var templates = {');
  templates.forEach(template);
  put('\n};\n\n');

  first = true;
  put('var controllers = {');
  controllers.forEach(controller);
  put('\n};\n\n');

  first = true;
  put('var routes = [');
  routes.forEach(route);
  put('\n];\n\n');

  put('module.exports = {\n');
  put('  templates: templates,\n');
  put('  controllers: controllers,\n');
  put('  routes: routes\n');
  put('};\n');

  function template (data) {
    var relative = unixrelative(rc.views, data);
    put(br(!first));
    put('  "%s": require("%s")', getTemplateName(relative), getTemplatePath(relative));
    first = false;
  }

  function controller (data) {
    var relative = unixrelative(rc.client_controllers, data);
    put(br(!first));
    put('  "%s": require("%s")', getTemplateName(relative), getControllerPath(relative));
    first = false;
  }

  function br (comma) {
    return comma ? ',\n' : '\n';
  }

  function route (data) {
    var caching = data.cache === true || typeof data.cache === 'number';

    put(br(!first));
    put('  {\n');
    put('    route: "%s"%s', transform(data.route), br(data.action || data.ignore || caching));

    if (data.action) {
      put('    action: "%s"%s', data.action, br(data.ignore || caching));
    }
    if (data.ignore) {
      put('    ignore: true%s', br(caching));
    }
    if (caching) {
      put('    cache: %s\n', data.cache);
    }
    put('  }');
    first = false;
  }

  function put () {
    var value = util.format.apply(util, arguments);
    buffer.push(value);
  }

  return buffer.join('').replace(/"/g, '\'');
}

function unixrelative (from, to) {
  return path.relative(from, to).split(path.sep).join('/');
}

function getTemplateName (action) {
  return action.replace(/\.js$/, '');
}

function getTemplatePath (action) {
  var location = resolvers.getView(action);
  return relativeToWiring(location);
}

function getControllerPath (action) {
  var location = resolvers.getClientController(action);
  return relativeToWiring(location);
}

function relativeToWiring (to) {
  var base = path.dirname(rc.client_wiring);
  return relative(base, to);
}

function relative (base, to) {
  var result = unixrelative(base, to);
  if (result[0] === '.') {
    return result;
  }
  return './' + result;
}

module.exports = {
  render: render
};

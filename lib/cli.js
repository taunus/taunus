'use strict';

var fs = require('fs');
var glob = require('glob');
var path = require('path');
var util = require('util');
var rc = require('./rc');
var resolvers = require('./resolvers');
var shared = require('./resolvers.shared');
var defaults = require('./resolvers.cli');
var deferred = require('./deferred');

resolvers.use(shared);
resolvers.use(defaults);

function render (options, force) {
  if (options.resolvers) {
    resolvers.use(options.resolvers);
  }
  var location = path.resolve(rc.server_routes);
  if (force) {
    delete require.cache[location];
  }
  var routes = require(location);
  return compose(routes, options);
}

function compose (routes, options) {
  var buffer = [];
  var templates = glob.sync(path.join(rc.views, '**/*.js'));
  var controllers = glob.sync(path.join(rc.client_controllers, '**/*.js'));
  var deferreds = options.deferred.length;
  var first;

  put('"use strict";\n\n');

  first = true;
  put('var templates = {');
  templates.map(templateRelative).filter(immediate).forEach(template);
  put('\n};\n\n');

  first = true;
  put('var controllers = {');
  controllers.map(controllerRelative).filter(immediate).forEach(controller);
  put('\n};\n\n');

  first = true;
  put('var routes = [');
  routes.forEach(route);
  put('\n];\n\n');

  if (deferreds) {
    first = true;
    put('var deferrals = [');
    options.deferred.forEach(deferral);
    put('\n];\n\n');
  }

  put('module.exports = {\n');
  put('  templates: templates,\n');
  put('  controllers: controllers,\n');
  put('  routes: routes%s', br(deferreds));
  if (deferreds) {
    put('  deferrals: deferrals\n');
  }
  put('};\n');

  return buffer.join('').replace(/"/g, '\'');

  function templateRelative (file) {
    return unixrelative(rc.views, file);
  }

  function template (file) {
    put(br(!first));
    put('  "%s": require("%s")', getActionName(file), getTemplatePath(file));
    first = false;
  }

  function controllerRelative (file) {
    return unixrelative(rc.client_controllers, file);
  }

  function controller (file) {
    put(br(!first));
    put('  "%s": require("%s")', getActionName(file), getControllerPath(file));
    first = false;
  }

  function route (data) {
    var caching = data.cache === true || typeof data.cache === 'number';

    put(br(!first));
    put('  {\n');
    put('    route: "%s"%s', options.transform(data.route), br(data.action || data.ignore || caching));

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

  function deferral (data) {
    put(br(!first));
    put('  "%s"', data);
    first = false;
  }

  function immediate (file) {
    return deferred(getActionName(file), options.deferred) === false;
  }

  function put () {
    var value = util.format.apply(util, arguments);
    buffer.push(value);
  }

  function br (comma) {
    return comma ? ',\n' : '\n';
  }
}

function unixrelative (from, to) {
  return path.relative(from, to).split(path.sep).join('/');
}

function getActionName (file) {
  return file.replace(/\.js$/, '');
}

function getTemplatePath (file) {
  var location = resolvers.getView(file);
  return relativeToWiring(location);
}

function getControllerPath (file) {
  var location = resolvers.getClientController(file);
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

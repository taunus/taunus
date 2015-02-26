'use strict';

var url = require('fast-url-parser');
var ruta3 = require('ruta3');
var location = require('./global/location');
var queryparser = require('../lib/queryparser');
var matcher = ruta3();
var protocol = /^[a-z]+?:\/\//i;

function getFullUrl (raw) {
  var base = location.href.substr(location.origin.length);
  var hashless;
  if (!raw) {
    return base;
  }
  if (raw[0] === '#') {
    hashless = base.substr(0, base.length - location.hash.length);
    return hashless + raw;
  }
  if (protocol.test(raw)) {
    if (raw.indexOf(location.origin) === 0) {
      return raw.substr(location.origin.length);
    }
    return null;
  }
  return raw;
}

function router (raw) {
  var full = getFullUrl(raw);
  if (full === null) {
    return null;
  }
  var parts = url.parse(full, true);
  var info = matcher.match(parts.pathname);

  global.DEBUG && global.DEBUG('[router] %s produces %o', raw, info);

  var route = info ? merge(info) : null;
  if (route === null || route.ignore) {
    return null;
  }

  route.url = full;
  route.hash = parts.hash || '';
  route.query = queryparser(parts.query);
  route.path = parts.path;
  route.pathname = parts.pathname;
  route.search = parts.search;

  global.DEBUG && global.DEBUG('[router] %s yields %s', raw, route.route);

  return route;
}

function merge (info) {
  var route = Object.keys(info.action).reduce(copyOver, {
    params: info.params
  });
  info.params.args = info.splats;

  return route;

  function copyOver (route, key) {
    route[key] = info.action[key]; return route;
  }
}

function setup (definitions) {
  definitions.forEach(define);
}

function define (definition) {
  if (typeof definition.action !== 'string') {
    definition.action = null;
  }
  matcher.addRoute(definition.route, definition);
}

function equals (left, right) {
  return left && right && left.path === right.path;
}

router.setup = setup;
router.equals = equals;

module.exports = router;

'use strict';

var defaultMatcher = /:([a-z]+)(\((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+\))?(\?)?/ig;
var routes;
var matcher;

function find (action) {
  var i;
  for (i = 0; i < routes.length; i++) {
    if (routes[i].action === action) {
      return routes[i].route;
    }
  }
  return null;
}

function use (m) {
  matcher = m || defaultMatcher;
}

function set (r) {
  routes = r || [];
}

function resolve (action, data) {
  var props = data || {};
  var route = find(action);
  if (route === null) {
    return null;
  }
  return route.replace(matcher, replacer) + queryString(props.args);

  function replacer (match, key, optional) {
    var value = props[key];
    if (value !== void 0 && value !== null) {
      return props[key];
    }
    if (key in props || optional) {
      return '';
    }
    throw new Error('Route ' + route + ' expected "' + key + '" parameter.');
  }

  function queryString (args) {
    var parts = args || {};
    var query = Object.keys(parts).map(keyValuePair).join('&');
    if (query) {
      return '?' + query;
    }
    return '';

    function keyValuePair (prop) {
      var value = parts[prop];
      if (value === void 0 || value === null || value === '') {
        return prop;
      }
      return prop + '=' + value;
    }
  }
}

use();
set();

resolve.use = use;
resolve.set = set;

module.exports = resolve;

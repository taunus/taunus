'use strict';

var matcher = /:([a-z]+)(\?)?/ig;

function find (routes, action) {
  var i;
  for (i = 0; i < routes.length; i++) {
    if (routes[i].action === action) {
      return routes[i].route;
    }
  }
  return null;
}

module.exports = function (routes, action, data) {
  var props = data || {};
  var match = find(routes, action);
  if (match === null) {
    return null;
  }
  return match.replace(matcher, replacer) + queryString(props.args);

  function replacer (match, key, optional) {
    var prop = props[key];
    if (prop) {
      return prop;
    }
    if (optional) {
      return '';
    }
    throw new Error('Route ' + match + ' expected missing "' + key + '" data property.');
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
      } else {
        return prop + '=' + value;
      }
    }
  }
};

'use strict';

var activator = require('./activator');

function links (element) {
  var a = element.getElementsByTagName('a');
  Array.prototype.slice.call(a).forEach(link);
}

function link (a) {
  var url = a.href;
  var route = getRoute(url);
  if (route === void 0) {
    return;
  }

  a.addEventListener('click', reroute);

  function reroute (e) {
    if (e.which === 1) { // left-click
      activator(url);
      e.preventDefault();
    }
  }
}

module.exports = routeLinks;

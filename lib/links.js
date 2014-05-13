'use strict';

function links (element) {
  var a = element.getElementsByTagName('a');
  Array.prototype.slice.call(a).forEach(link);
}

function link (a) {
  var url = a.href;
  var route = getRoute(url);
  if (route.key === void 0) {
    return;
  }

  a.addEventListener('click', reroute);

  function reroute (e) {
    if (e.which === 1) { // left-click
      activate(route.key, route.settings);
      e.preventDefault();
    }
  }
}

module.exports = routeLinks;

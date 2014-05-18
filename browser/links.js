'use strict';

var router = require('./router');
var activator = require('./activator');

function links () {
  document.body.addEventListener('click', reroute);
}

function reroute (e) {
  if (e.target.href && e.which === 1 && !e.metaKey && !e.ctrlKey) { // left-click on an anchor
    link(e, e.target);
  }
}

function link (e, a) {
  var url = a.href;
  var route = router(url);
  if (route === void 0) {
    return;
  }
  activator.go(url);
  e.preventDefault();
}

module.exports = links;

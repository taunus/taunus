'use strict';

var router = require('./router');
var activator = require('./activator');
var origin = document.location.origin;
var leftClick = 1;

function links () {
  document.body.addEventListener('click', reroute);
}

function so (a) {
  return a.origin === origin;
}

function leftClickOnLink (e) {
  return e.target.pathname && e.which === leftClick && !e.metaKey && !e.ctrlKey;
}

function reroute (e) {
  if (so(e.target) && leftClickOnLink(e)) {
    link(e);
  }
}

function link (e) {
  var url = e.target.pathname;
  var route = router(url);
  if (!route) {
    return;
  }
  activator.go(url);
  e.preventDefault();
}

module.exports = links;

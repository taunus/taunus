'use strict';

var router = require('./router');
var activator = require('./activator');
var origin = document.location.origin;
var leftClick = 1;

function links () {
  document.body.addEventListener('click', reroute);
}

function so (anchor) {
  return anchor.origin === origin;
}

function leftClickOnAnchor (e, anchor) {
  return anchor.pathname && e.which === leftClick && !e.metaKey && !e.ctrlKey;
}

function targetOrAnchor (e) {
  var anchor = e.target;
  while (anchor) {
    if (anchor.tagName === 'A') {
      return anchor;
    }
    anchor = anchor.parentElement;
  }
}

function reroute (e) {
  var anchor = targetOrAnchor(e);
  if (anchor && so(anchor) && leftClickOnAnchor(e, anchor)) {
    link(e, anchor);
  }
}

function link (e, anchor) {
  var url = anchor.pathname;
  if (url === location.pathname) {
    return;
  }
  var route = router(url);
  if (!route || route.ignore) {
    return;
  }
  activator.go(url, {
    context: anchor,
    query: anchor.search,
    hash: anchor.hash
  });
  e.preventDefault();
}

module.exports = links;

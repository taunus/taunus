'use strict';

var router = require('./router');
var activator = require('./activator');
var events = require('./events');
var origin = document.location.origin;
var leftClick = 1;

function links () {
  events.add(document.body, 'click', reroute);
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

function scrollInto (id) {
  var elem = document.getElementById(id);
  if (elem && elem.scrollIntoView) {
    elem.scrollIntoView();
  }
}

function link (e, anchor) {
  var url = anchor.pathname;
  if (url === location.pathname && anchor.hash) { // hash navigation under same page ignores router
    if (anchor.hash === location.hash) {
      scrollInto(anchor.hash.substr(1));
      e.preventDefault();
    }
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

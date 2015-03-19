'use strict';

var state = require('./state');
var router = require('./router');
var events = require('./events');
var prefetcher = require('./prefetcher');
var activator = require('./activator');
var document = require('./global/document');
var location = require('./global/location');
var origin = location.origin;
var body = document.body;
var leftClick = 1;
var prefetching = [];
var clicksOnHold = [];

function links () {
  if (state.prefetch && state.cache) { // prefetch without cache makes no sense
    global.DEBUG && global.DEBUG('[links] listening for prefetching opportunities');
    events.add(body, 'mouseover', maybePrefetch);
    events.add(body, 'touchstart', maybePrefetch);
  }
  global.DEBUG && global.DEBUG('[links] listening for rerouting opportunities');
  events.add(body, 'click', maybeReroute);
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

function maybeReroute (e) {
  var anchor = targetOrAnchor(e);
  if (anchor && so(anchor) && notjusthashchange(anchor) && leftClickOnAnchor(e, anchor) && routable(anchor)) {
    reroute(e, anchor);
  }
}

function attr (el, name) {
  var value = name in el ? el[name] : el.getAttribute(name);
  if (typeof value === 'string') {
    return value;
  }
  return null;
}

function routable (anchor) {
  return attr(anchor, 'download') === null && attr(anchor, 'target') !== '_blank' && attr(anchor, 'data-taunus-ignore') === null;
}

function notjusthashchange (anchor) {
  return (
    anchor.pathname !== location.pathname ||
    anchor.search !== location.search ||
    anchor.hash === location.hash
  );
}

function maybePrefetch (e) {
  var anchor = targetOrAnchor(e);
  if (anchor && so(anchor)) {
    prefetch(e, anchor);
  }
}

function noop () {}

function parse (anchor) {
  return anchor.pathname + anchor.search + anchor.hash;
}

function reroute (e, anchor) {
  var url = parse(anchor);
  var route = router(url);
  if (!route) {
    return;
  }

  prevent();

  if (prefetcher.busy(url)) {
    global.DEBUG && global.DEBUG('[links] navigation to %s blocked by prefetcher', route.url);
    prefetcher.registerIntent(url);
    return;
  }

  global.DEBUG && global.DEBUG('[links] navigating to %s', route.url);
  activator.go(route.url, { context: anchor });

  function prevent () { e.preventDefault(); }
}

function prefetch (e, anchor) {
  prefetcher.start(parse(anchor), anchor);
}

module.exports = links;

'use strict';

var raf = require('raf');
var clone = require('./clone');
var emitter = require('./emitter');
var fetcher = require('./fetcher');
var prefetcher = require('./prefetcher');
var view = require('./view');
var router = require('./router');
var state = require('./state');
var document = require('./global/document');
var location = require('./global/location');
var history = require('./global/history');
var versioning = require('../versioning');

function modern () { // `history.modern = false` used in tests
  return history && history.modern !== false;
}

function go (url, options) {
  var o = options || {};
  var direction = o.replaceState ? 'replaceState' : 'pushState';
  var context = o.context || null;
  var route = router(url);
  if (!route) {
    if (o.strict !== true) {
      global.DEBUG && global.DEBUG('[activator] redirecting to %s', url);
      location.href = url;
    }
    return;
  }

  global.DEBUG && global.DEBUG('[activator] route matches %s', route.route);

  var same = router.equals(route, state.route);
  if (same && o.force !== true) {
    if (route.parts.hash) {
      global.DEBUG && global.DEBUG('[activator] same route and hash, updating scroll position');
      scrollInto(id(route.parts.hash), o.scroll);
      navigation(route, state.model, direction);
      return; // anchor hash-navigation on same page ignores router
    }
    global.DEBUG && global.DEBUG('[activator] same route, resolving');
    resolved(state.model);
    return;
  }

  global.DEBUG && global.DEBUG('[activator] not same route as before');

  if (!modern()) {
    global.DEBUG && global.DEBUG('[activator] not modern, redirecting to %s', url);
    location.href = url;
    return;
  }

  global.DEBUG && global.DEBUG('[activator] fetching %s', route.url);
  prefetcher.abortIntent();
  fetcher.abortPending();
  fetcher(route, { element: context, source: 'intent' }, maybeResolved);

  function maybeResolved (err, data) {
    if (err) {
      return;
    }
    if (data.version !== state.version) {
      global.DEBUG && global.DEBUG('[activator] version change (is "%s", was "%s"), redirecting to %s', data.version, state.version, url);
      location.href = url; // version change demands fallback to strict navigation
      return;
    }
    resolved(data.model);
  }

  function resolved (model) {
    navigation(route, model, direction);
    view(state.container, null, model, route);
    scrollInto(id(route.parts.hash), o.scroll);
  }
}

function start (data) {
  if (data.version !== state.version) {
    global.DEBUG && global.DEBUG('[activator] version change, reloading browser');
    location.reload(); // version may change between Taunus loading and a model becoming available
    return;
  }
  var model = data.model;
  var route = getRouteAndReplaceHistory(model);
  emitter.emit('start', state.container, model, route);
  global.DEBUG && global.DEBUG('[activator] started, executing client-side controller');
  view(state.container, null, model, route, { render: false });
  global.onpopstate = back;
}

function back (e) {
  var empty = !(e && e.state && e.state.model);
  if (empty) {
    return;
  }
  global.DEBUG && global.DEBUG('[activator] backwards history navigation with state', e.state);
  var model = e.state.model;
  var route = getRouteAndReplaceHistory(model);
  view(state.container, null, model, route);
  scrollInto(id(route.parts.hash));
}

function scrollInto (id, enabled) {
  if (enabled === false) {
    return;
  }
  global.DEBUG && global.DEBUG('[activator] scrolling into "%s"', id || '#document');

  var elem = id && document.getElementById(id) || document.documentElement;
  if (elem && elem.scrollIntoView) {
    console.log('FOO');
    raf(scrollSoon);
  }else{console.log('BAR');}

  function scrollSoon () {console.log('SCROLLA SOONA')
    elem.scrollIntoView();
  }
}

function id (hash) {
  return orEmpty(hash).substr(1);
}

function getRouteAndReplaceHistory (model) {
  var url = location.pathname;
  var query = orEmpty(location.search) + orEmpty(location.hash);
  var route = router(url + query);
  navigation(route, model, 'replaceState');
  return route;
}

function orEmpty (value) {
  return value || '';
}

function navigation (route, model, direction) {
  global.DEBUG && global.DEBUG('[activator] pushing %s into history', route.url);
  state.route = route;
  state.model = clone(model);
  if (model.title) {
    document.title = model.title;
  }
  if (modern() && history[direction]) {
    history[direction]({ model: model }, model.title, route.url);
  }
}

module.exports = {
  start: start,
  go: go
};

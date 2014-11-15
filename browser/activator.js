'use strict';

var raf = require('raf');
var clone = require('./clone');
var emitter = require('./emitter');
var fetcher = require('./fetcher');
var partial = require('./partial');
var router = require('./router');
var state = require('./state');
var nativeFn = require('./nativeFn');
var versioning = require('../versioning');
var modern = 'history' in window && 'pushState' in history;

// Google Chrome 38 on iOS makes weird changes to history.replaceState, breaking it
var nativeReplace = modern && nativeFn(window.history.replaceState);

function go (url, options) {
  var o = options || {};
  var direction = o.replaceState ? 'replaceState' : 'pushState';
  var context = o.context || null;
  var route = router(url);
  if (!route) {
    if (o.strict !== true) {
      location.href = url;
    }
    return;
  }

  var same = router.equals(route, state.route);
  if (same && o.force !== true) {
    if (route.parts.hash) {
      scrollInto(id(route.parts.hash), o.scroll);
      navigation(route, state.model, direction);
      return; // anchor hash-navigation on same page ignores router
    }
    resolved(state.model);
    return;
  }

  if (!modern) {
    location.href = url;
    return;
  }

  fetcher.abortPending();
  fetcher(route, { element: context, source: 'intent' }, maybeResolved);

  function maybeResolved (err, data) {
    if (err) {
      return;
    }
    if (data.version !== state.version) {
      location.href = url; // version change demands fallback to strict navigation
      return;
    }
    resolved(data.model);
  }

  function resolved (model) {
    navigation(route, model, direction);
    partial(state.container, null, model, route);
    scrollInto(id(route.parts.hash), o.scroll);
  }
}

function start (data) {
  if (data.version !== state.version) {
    location.reload(); // version may change between Taunus loading and a model becoming available
    return;
  }
  var model = data.model;
  var route = replaceWith(model);
  emitter.emit('start', state.container, model);
  partial(state.container, null, model, route, { render: false });
  window.onpopstate = back;
}

function back (e) {
  var empty = !(e && e.state && e.state.model);
  if (empty) {
    return;
  }
  var model = e.state.model;
  var route = replaceWith(model);
  partial(state.container, null, model, route);
  scrollInto(id(route.parts.hash));
}

function scrollInto (id, enabled) {
  if (enabled === false) {
    return;
  }
  var elem = id && document.getElementById(id) || document.documentElement;
  if (elem && elem.scrollIntoView) {
    raf(scrollSoon);
  }

  function scrollSoon () {
    elem.scrollIntoView();
  }
}

function id (hash) {
  return orEmpty(hash).substr(1);
}

function replaceWith (model) {
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
  state.route = route;
  state.model = clone(model);
  if (model.title) {
    document.title = model.title;
  }
  if (modern && direction !== 'replaceState' || nativeReplace) {
    history[direction]({ model: model }, model.title, route.url);
  }
}

module.exports = {
  start: start,
  go: go
};

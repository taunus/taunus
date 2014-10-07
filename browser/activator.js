'use strict';

var emitter = require('./emitter');
var fetcher = require('./fetcher');
var partial = require('./partial');
var router = require('./router');
var state = require('./state');
var modern = 'history' in window && 'pushState' in history;

function go (url, o) {
  var options = o || {};
  var context = options.context || null;
  var q = options.query || '';
  var s = options.search || '';

  if (!modern) {
    location.href = url + q; return;
  }
  fetcher(url + jsonify(q), context, resolved);

  function jsonify (q) {
    return (q ? q + '&' : '?') + 'json';
  }

  function resolved (data) {
    var route = router(url);
    var model = data.model;
    navigation(url + q + s, model, 'pushState');
    partial(state.container, null, model, route);
  }
}

function start (model) {
  var route = navigate(model);
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
  var route = navigate(model);
  partial(state.container, null, model, route);
}

function navigate (model) {
  var url = location.pathname;
  var query = '' + location.search + location.hash;
  var route = router(url);
  navigation(url + query, model, 'replaceState');
  return route;
}

function navigation (url, model, direction) {
  document.title = model.title;
  state.model = model;
  if (modern) {
    history[direction]({ model: model }, model.title, url);
  }
}

module.exports = {
  start: start,
  go: go
};

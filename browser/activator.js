'use strict';

var emitter = require('./emitter');
var fetcher = require('./fetcher');
var partial = require('./partial');
var router = require('./router');
var state = require('./state');

function go (url) {
  fetcher(url, next);

  function next (res) {
    var route = router(url);
    var model = res.model;
    document.title = model.title;
    navigation(url, model, 'pushState');
    partial(state.container, model.action || route.action, model, route);
  }
}

function start (model) {
  var url = location.pathname;
  var route = router(url);
  navigation(url, model, 'replaceState');
  emitter.emit('start', state.container, model);
  emitter.emit('render', state.container, model);

  var controller = state.controllers[model.action || route.action];
  if (controller) {
    controller(model, route);
  }
  window.onpopstate = back;
}

function back (e) {
  var empty = !(e || e.state || e.state.model);
  if (empty) {
    return;
  }
  var model = e.state.model;
  var url = location.pathname;
  var route = router(url);
  navigation(url, model, 'replaceState');
  partial(state.container, model.action || route.action, model, route);
}

function navigation (url, model, direction) {
  history[direction]({ model: model }, model.title, url);
}

module.exports = {
  start: start,
  go: go
};

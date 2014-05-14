'use strict';

var fetcher = require('./fetcher');
var links = require('./links');
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
    partial(state.container, route.template, route.controller, model);
  }
}

function start (model) {
  var url = location.pathname;
  var route = router(url);
  navigation(url, model, 'replaceState');
  links(document.body);
  route.controller(model);

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
  partial(state.container, route.template, route.controller, model);
}

function navigation (url, model, action) {
  history[action]({ model: model }, model.title, url);
}

module.exports = {
  start: start,
  go: go
};

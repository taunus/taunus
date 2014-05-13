'use strict';

var router = require('./router');
var state = require('./state');

function start (model) {
  navigation(location.pathname, model, 'replaceState');
  window.onpopstate = popState;
}

function popState (e) {
  var empty = !(e || e.state || e.state.model);
  if (empty) {
    return;
  }
  navigation(location.pathname, e.state.model, 'replaceState');
}

function navigation (url, model, action) {
  var route = router(url);
  var state = { model: model };
  history[action || 'pushState'](state, model.title, url);
  route.controller(model);
}

navigation.start = start;

module.exports = navigation;

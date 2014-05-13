'use strict';

var router = require('./router');
var partial = require('./partial');
var navigation = require('./navigation');

function activator (url) {
  var route = router(url);

  route.fetch(activate);

  function activate (model) {
    document.title = model.title;
    partial(state.container, route.template, route.controller, model);
    navigation(url, model);
  }
}

module.exports = activator;

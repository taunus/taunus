'use strict';

var gradual = require('gradual');
var crossvent = require('crossvent');
var state = require('./state');
var document = require('./global/document');
var body = document.body;

function setup () {
  if (state.forms === false) {
    global.DEBUG && global.DEBUG('[gradual] disabled');
    return;
  }
  global.DEBUG && global.DEBUG('[gradual] enabled');
  gradual.configure({
    taunus: global.taunus,
    qs: state.qs
  });
  crossvent.add(body, 'submit', maybeHijack);
}

function maybeHijack (e) {
  if (e.target.tagName === 'FORM') {
    global.DEBUG && global.DEBUG('[gradual] hijacking form submission');
    gradual.hijack(e);
  }
}

module.exports = {
  setup: setup
};

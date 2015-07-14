'use strict';

var taunus = require('./');
var boundConsoleLog;
var originalConsole = console;
if (originalConsole.log) {
  boundConsoleLog = Function.prototype.bind.call(originalConsole.log, originalConsole);
}

filter();
DEBUG.filter = filter;
module.exports = taunus;

function DEBUG () {
  if (boundConsoleLog) {
    boundConsoleLog.apply(originalConsole, arguments);
  }
}

function filter (type) {
  if (!type) {
    global.DEBUG = DEBUG; return;
  }
  var matchesType = '^\\[(' + type + ')\\]';
  var rtyped = new RegExp(matchesType, 'i');

  global.DEBUG = filtered;

  function filtered (first) {
    if (rtyped.test(first)) {
      DEBUG.apply(this, arguments);
    }
  }
}

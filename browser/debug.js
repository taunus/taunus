'use strict';

var boundConsoleLog;
var taunus = require('./');
var originalConsole = console;
if (originalConsole.log) {
  boundConsoleLog = Function.prototype.bind.call(originalConsole.log, originalConsole);
}

global.DEBUG = DEBUG;
module.exports = taunus;

function DEBUG () {
  if (boundConsoleLog) {
    boundConsoleLog.apply(originalConsole, arguments);
  }
}

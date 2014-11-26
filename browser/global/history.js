'use strict';

var modern = 'history' in window && 'pushState' in history;
var api = modern && history;

// Google Chrome 38 on iOS makes weird changes to history.replaceState, breaking it
var nativeFn = require('../nativeFn');
var nativeReplaceBroken = !modern || !nativeFn(history.replaceState);
if (nativeReplaceBroken) {
  api = {
    pushState: history.pushState.bind(history)
  };
}

module.exports = api;

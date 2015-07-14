'use strict';

var intent = null;
var prefetcherIntent = {
  is: is,
  set: set,
  abort: abort
};

function is (url) {
  return intent === url;
}

function set (url) {
  intent = url;
}

function abort (url) {
  intent = null;
}

module.exports = prefetcherIntent;

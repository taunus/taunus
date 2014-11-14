'use strict';

var t = require('./version.json');

function get (v) {
  return 't' + t + ';v' + v;
}

function match (v, expected) {
  return v === expected;
}

function ensure (v, expected) {
  var mismatch = !match(v, expected);
  if (mismatch) {
    global.location.reload();
  }
  return mismatch;
}

module.exports = {
  get: get,
  match: match,
  ensure: ensure
};

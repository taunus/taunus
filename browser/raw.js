'use strict';

var raw = {};

function get (key) {
  return raw[key];
}

function set (key, value) {
  raw[key] = value;
}

module.exports = {
  set: set,
  get: get
};

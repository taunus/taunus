'use strict';

function clone (value) {
  return JSON.parse(JSON.stringify(value));
}

module.exports = clone;

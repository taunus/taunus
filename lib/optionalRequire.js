'use strict';

var util = require('util');

function optionalRequire (path, parent) {
  try {
    return parent.require(path);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND' && e.message === util.format('Cannot find module \'%s\'', path)) {
      return null;
    } else {
      throw e;
    }
  }
}

module.exports = optionalRequire;

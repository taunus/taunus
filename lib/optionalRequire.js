'use strict';

function optionalRequire (path, parent) {
  try {
    return parent.require(path);
  } catch (e) {
    return null;
  }
}

module.exports = optionalRequire;

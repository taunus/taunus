'use strict';

function optionalRequire (path) {
  try {
    return module.parent.require(path);
  } catch (e) {
    return null;
  }
}

module.exports = optionalRequire;

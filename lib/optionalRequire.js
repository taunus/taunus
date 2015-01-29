'use strict';

function optionalRequire (path, parent) {
  try {
    return parent.require(path);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      return null;
    } else {
      throw e;
    }
  }
}

module.exports = optionalRequire;

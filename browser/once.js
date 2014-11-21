'use strict';

module.exports = function disposable (fn) {
  var used;
  return function once () {
    if (used) { return; } used = true;
    return fn.apply(this, arguments);
  };
};

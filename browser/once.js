'use strict';

module.exports = function disposable (fn) {
  var used;
  var result;
  return function once () {
    if (used) { return result; } used = true;
    return (result = fn.apply(this, arguments));
  };
};

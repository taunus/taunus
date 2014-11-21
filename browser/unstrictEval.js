// this module doesn't use strict, so eval is unstrict.

module.exports = function (code) {
  /* jshint evil:true */
  return eval(code);
};

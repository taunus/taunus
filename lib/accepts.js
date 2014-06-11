'use strict';

module.exports = function (req, types) {
  var header = req.headers.accept || '';
  var result = {};

  types.forEach(function match (type) {
    result[type] = ~header.indexOf(type);
  });

  return result;
};

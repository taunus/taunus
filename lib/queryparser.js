'use strict';

var rdigits = /^[+-]?\d+$/;

function queryparser (query) {
  return Object.keys(query).reduce(parsed, {});
  function parsed (result, key) {
    result[key] = field(query[key]);
    return result;
  }
}

function field (value) {
  if (rdigits.test(value)) {
    return parseInt(value, 10);
  }
  if (value === '' || value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return value;
}

queryparser.field = field;
module.exports = queryparser;

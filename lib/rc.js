'use strict';

var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var rc = path.join(cwd, '.taunusrc');

module.exports = function () {
  var raw;
  try {
    raw = fs.readFileSync(rc, { encoding: 'utf8' });
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

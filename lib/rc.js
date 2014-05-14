'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var defaults = require('./rc.json');
var cwd = process.cwd();
var rc = path.join(cwd, '.taunusrc');

module.exports = function () {
  var raw;
  var json;
  try {
    raw = fs.readFileSync(rc, { encoding: 'utf8' });
    json = JSON.parse(raw);
    return _.extend({}, defaults, json);
  } catch (e) {
    return defaults;
  }
};

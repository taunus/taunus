'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var defaults = require('./rc.defaults.json');
var cwd = process.cwd();
var rc = path.join(cwd, '.taunusrc');

function read () {
  var raw;
  var json;
  var exists = fs.existsSync(rc);
  if (exists) {
    raw = fs.readFileSync(rc, { encoding: 'utf8' });
    json = JSON.parse(raw);
    return _.extend({}, defaults, json);
  } else {
    return defaults;
  }
}

module.exports = read();

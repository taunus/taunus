'use strict';

var fs = require('fs');
var path = require('path');
var assign = require('assignment');
var defaults = require('./.taunusrc.defaults.json');
var pkg = path.resolve('./package.json');
var rc = path.resolve('.taunusrc');

function manifest () {
  var json;
  var exists = fs.existsSync(pkg);
  if (exists) {
    json = require(pkg).taunus;
  }
  if (json) {
    return json;
  }
  return dotfile();
}

function dotfile () {
  var raw;
  var json;
  var exists = fs.existsSync(rc);
  if (exists) {
    raw = fs.readFileSync(rc, { encoding: 'utf8' });
    json = JSON.parse(raw);
    return json;
  }
}

module.exports = assign({}, defaults, manifest());

'use strict';

var path = require('path');
var browserify = require('browserify');
var cache = {};

function bro (file, done) {
  var resolved = path.resolve(file);
  if (cache[resolved]) {
    end(null);
  }
  browserify().add(resolved).bundle(bundled);
  function bundled (err, data) {
    cache[resolved] = data;
    end(err);
  }
  function end (err) {
    done(err, cache[resolved]);
  }
}

module.exports = bro;

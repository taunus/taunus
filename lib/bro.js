'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var contra = require('contra');
var browserify = require('browserify');
var uglify = require('uglify-js');
var cache = {};

function bro (file, done) {
  var resolved = path.resolve(file);
  if (resolved in cache) {
    end(); return;
  }

  fs.exists(resolved, work);

  function work (exists) {
    if (exists) {
      contra.waterfall([browser, minify], end);
    } else {
      cache[resolved] = null; end();
    }
  }

  function browser (next) {
    browserify().require(resolved, { expose: 'extract' }).bundle(next);
  }

  function minify (data, next) {
    var minified = uglify.minify(data, { fromString: true });
    var bundle = util.format('(function(){return %s})()("extract")', minified.code);
    cache[resolved] = bundle;
    next();
  }

  function end (err) {
    done(err, cache[resolved]);
  }
}

module.exports = bro;

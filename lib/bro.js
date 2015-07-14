'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var contra = require('contra');
var browserify = require('browserify');
var aliasify = require('aliasify');
var uglify = require('uglify-js');
var state = require('./state');
var minify = state.deferMinified;
var cache = {};
var rpath = /^\.*\//;
var absolute = path.resolve(__dirname, '../global');
var relative = path.relative(process.cwd(), absolute);
var globally = rpath.test(relative) ? relative : './' + relative;

function bro (file, done) {
  var resolved = path.resolve(file);
  if (resolved in cache) {
    end(null); return;
  }

  fs.exists(resolved, work);

  function work (exists) {
    if (exists) {
      contra.waterfall([browser, adjust, wrap], end);
    } else {
      cache[resolved] = null; end(null);
    }
  }

  function browser (next) {
    browserify({ debug: !minify })
      .transform(aliasify.configure({
        aliases: { taunus: globally }
      }))
      .require(resolved, { expose: 'extract' })
      .bundle(next);
  }

  function adjust (bundle, next) {
    var raw = String(bundle);

    if (minify) {
      next(null, uglify.minify(raw, { fromString: true }).code);
    } else {
      next(null, raw);
    }
  }

  function wrap (bundle, next) {
    var wrapper = '(function(){return %s\n})()("extract")'; // break necessary because source-map comment
    var wrapped = util.format(wrapper, bundle);
    cache[resolved] = wrapped;
    next();
  }

  function end (err) {
    done(err, cache[resolved]);
  }
}

module.exports = bro;

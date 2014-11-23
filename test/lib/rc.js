'use strict';

var _ = require('lodash');
var path = require('path');
var test = require('tape');
var proxyquire = require('proxyquire');
var defaults = require('../../lib/.taunusrc.defaults.json');
var cases = {
  'rc uses defaults': {
    pkg: {}, rc: {}, got: defaults
  },
  'rc extends defaults': {
    pkg: {}, rc: {foo:'bar'}, got: _.assign({}, defaults, {foo:'bar'})
  },
  'pkg extends defaults': {
    pkg: {taunus:{foo:'bar'}}, rc: {}, got: _.assign({}, defaults, {foo:'bar'})
  },
  'pkg ignores rc': {
    pkg: {taunus:{foo:'bar'}}, rc: {bar: 'baz'}, got: _.assign({}, defaults, {foo:'bar'})
  },
  'rc overrides defaults': {
    pkg: {}, rc: {views:'views'}, got: _.assign({}, defaults, {views:'views'})
  }
};

Object.keys(cases).forEach(function register (tc) {
  test(tc, function (t) {
    var stub = {
      fs: {
        existsSync: existsSync,
        readFileSync: readFileSync
      }
    };
    stub[path.resolve('./package.json')] = cases[tc].pkg;
    var map = {'.taunusrc': JSON.stringify(cases[tc].rc)};
    var rc = proxyquire('../../lib/rc', stub);
    t.deepEqual(rc, cases[tc].got);
    t.end();

    function existsSync () {
      return true;
    }

    function readFileSync (file) {
      return map[path.relative(process.cwd(),file)];
    }
  });
});

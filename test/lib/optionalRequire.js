'use strict';

var test = require('tape');

test('optionalRequire fails silently', function (t) {
  var optionalRequire = require('../../lib/optionalRequire');
  t.equal(optionalRequire('./foo', module), null);
  t.equal(optionalRequire('./fixture/baz', module), require('./fixture/baz'));
  t.end();
});

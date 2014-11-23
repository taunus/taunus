'use strict';

var test = require('tape');

test('optionalRequire fails silently', function (t) {
  var optionalRequire = require('../../lib/optionalRequire');
  t.equal(optionalRequire('./foo', module), null);
  t.equal(optionalRequire('./fixture/foo', module), require('./fixture/foo'));
  t.end();
});

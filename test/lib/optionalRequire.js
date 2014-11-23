'use strict';

var test = require('tape');

test('optionalRequire fails silently', function (t) {
  var optionalRequire = require('../../lib/optionalRequire');
  t.equal(optionalRequire('./foo'), null);
  t.equal(optionalRequire('./fixture/foo'), require('./fixture/foo'));
  t.end();
});

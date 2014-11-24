'use strict';

var path = require('path');
var test = require('tape');
var proxyquire = require('proxyquire');

test('resolvers', function (t) {
  var resolvers = require('../../lib/resolvers');
  t.ok(typeof resolvers.use === 'function', 'has .use method');
  t.end();
});

test('resolvers.use overrides', function (t) {
  var resolvers = require('../../lib/resolvers');
  resolvers.use({foo:'foo',bar:'bar'});
  t.equal(resolvers.foo, 'foo');
  t.equal(resolvers.bar, 'bar');
  t.end();
});

test('.use is reserved', function (t) {
  var resolvers = require('../../lib/resolvers');
  var use = resolvers.use;
  resolvers.use({use:'use'});
  t.equal(resolvers.use, use);
  t.end();
});

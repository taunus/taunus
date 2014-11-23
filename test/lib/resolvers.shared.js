'use strict';

var path = require('path');
var test = require('tape');
var proxyquire = require('proxyquire');

test('shared resolvers', function (t) {
  var resolvers = proxyquire('../../lib/resolvers.shared', {
    './rc': {views:'bar'}
  });
  t.ok(typeof resolvers.getView === 'function', 'has getView method');
  t.equal(resolvers.getView('foo'), path.resolve('bar/foo'));
  t.equal(resolvers.getView('../foo'), path.resolve('foo'));
  t.equal(resolvers.getView('foo/tar'), path.resolve('bar/foo/tar'));
  t.end();
});

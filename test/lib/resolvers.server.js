'use strict';

var path = require('path');
var test = require('tape');
var proxyquire = require('proxyquire');

test('server resolvers', function (t) {
  var resolvers = proxyquire('../../lib/resolvers.server', {
    './rc': {server_controllers:'bar'}
  });
  t.ok(typeof resolvers.getServerController === 'function', 'has getServerController method');
  t.equal(resolvers.getServerController('foo'), path.resolve('bar/foo'));
  t.equal(resolvers.getServerController('../foo'), path.resolve('foo'));
  t.equal(resolvers.getServerController('foo/tar'), path.resolve('bar/foo/tar'));
  t.end();
});

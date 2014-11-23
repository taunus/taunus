'use strict';

var path = require('path');
var test = require('tape');
var proxyquire = require('proxyquire');

test('cli resolvers', function (t) {
  var resolvers = proxyquire('../../lib/resolvers.cli', {
    './rc': {client_controllers:'bar'}
  });
  t.ok(typeof resolvers.getClientController === 'function', 'has getClientController method');
  t.equal(resolvers.getClientController('foo'), path.resolve('bar/foo'));
  t.equal(resolvers.getClientController('../foo'), path.resolve('foo'));
  t.equal(resolvers.getClientController('foo/tar'), path.resolve('bar/foo/tar'));
  t.end();
});

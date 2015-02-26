'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var route1 = {
  route: '/foo',
  cache: 5
};
var route2 = {
  route: '/bar',
  action: 'bar'
};
var route3 = {
  route: '/bar/do',
  ignore: true
};
var defs = [route1, route2, route3];

test('router exposes API', function (t) {
  var router = proxyquire('../../browser/router', {});
  t.equal(typeof router, 'function');
  t.equal(typeof router.setup, 'function');
  t.equal(typeof router.equals, 'function');
  t.end();
});

test('router setup exposes routes', function (t) {
  var matcher = {
    addRoute: sinon.spy()
  };
  var ruta3 = sinon.stub().returns(matcher);
  var router = proxyquire('../../browser/router', {
    'ruta3': ruta3
  });
  router.setup(defs);
  t.equal(matcher.addRoute.callCount, defs.length);
  t.deepEqual(matcher.addRoute.firstCall.args[1], {
    route: '/foo', action: null, cache: 5
  });
  t.deepEqual(matcher.addRoute.secondCall.args[1], {
    route: '/bar', action: 'bar' });
  t.deepEqual(matcher.addRoute.thirdCall.args[1], {
    route: '/bar/do', action: null, ignore: true });
  t.end();
});

test('router.equals returns accurate information about route matching', function (t) {
  var router = proxyquire('../../browser/router', {});
  router.setup(defs);
  t.notOk(router.equals(false,false));
  t.notOk(router.equals(router('/foo'),router('/bar')));
  t.notOk(router.equals(router('/foo?q=a'),router('/foo')));
  t.notOk(router.equals(router('/foo?p=1'),router('/foo')));
  t.ok(router.equals(router('/foo'),router('/foo')));
  t.ok(router.equals(router('/foo?q=a'),router('/foo?q=a')));
  t.ok(router.equals(router('/foo?q=a&b'),router('/foo?q=a&b')));
  t.ok(router.equals(router('/foo?q=a'),router('/foo?q=a#bc')));
  t.end();
});

test('router(url) should return route when matched', function (t) {
  var router = proxyquire('../../browser/router', {});
  router.setup(defs);
  t.deepEqual(router('/foo'), {
    action: null,
    cache: 5,
    hash: '',
    params: { args: [] },
    path: '/foo',
    pathname: '/foo',
    query: {},
    route: '/foo',
    search: '',
    url: '/foo'
  });
  t.deepEqual(router('/bar'), {
    action: 'bar',
    hash: '',
    params: { args: [] },
    path: '/bar',
    pathname: '/bar',
    query: {},
    route: '/bar',
    search: '',
    url: '/bar'
  });
  t.equal(router('/bar/do'), null);
  t.deepEqual(router('/bar?foo=1&bar&boo=false&bart=true&bort=bar&sort=-1#troz'), {
    action: 'bar',
    hash: '#troz',
    params: { args: [] },
    path: '/bar?foo=1&bar&boo=false&bart=true&bort=bar&sort=-1',
    pathname: '/bar',
    query: { bar: true, bart: true, boo: false, bort: 'bar', foo: 1, sort: -1 },
    route: '/bar',
    search: '?foo=1&bar&boo=false&bart=true&bort=bar&sort=-1',
    url: '/bar?foo=1&bar&boo=false&bart=true&bort=bar&sort=-1#troz'
  });
  t.end();
});

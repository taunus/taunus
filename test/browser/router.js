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
  t.notOk(router.equals(false,false));
  t.notOk(router.equals({route:'/foo'},{route:'/bar'}));
  t.notOk(router.equals({route:'/foo',parts:{search:'a'}},{route:'/foo',parts:{}}));
  t.notOk(router.equals({route:'/foo',params: {p:1}},{route:'/foo'}));
  t.notOk(router.equals({route:'/foo',params: {p:1}},{route:'/bar',params: {p:1}}));
  t.ok(router.equals({route:'/foo',params: {p:1},parts:{search:'a'}},{route:'/foo',params: {p:1},parts:{search:'a'}}));
  t.ok(router.equals({route:'/foo',params: {args:['foo']}, parts:{search:''}},{route:'/foo',params: {args:['foo']}, parts:{search:''}}));
  t.end();
});

test('router(url) should return route when matched', function (t) {
  var router = proxyquire('../../browser/router', {});
  router.setup(defs);
  var r1 = router('/foo');
  var p1 = r1.parts;
  delete r1.parts;
  t.deepEqual(r1, {
    action: null,
    cache: 5,
    params: { args: [] },
    route: '/foo',
    url: '/foo'
  });
  var r2 = router('/bar');
  var p2 = r2.parts;
  delete r2.parts;
  t.deepEqual(r2, {
    action: 'bar',
    params: { args: [] },
    route: '/bar',
    url: '/bar'
  });
  t.deepEqual(router('/bar/do'), null);
  t.end();
});

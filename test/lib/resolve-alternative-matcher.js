'use strict';

var test = require('tape');
var proxyquire = require('proxyquire');
var hapimatcher = /\{([a-z]+)(\?)?\}/ig;

test('alternative matcher: resolve has .use method', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  t.equal(typeof resolve.use, 'function');
  t.end();
});

test('alternative matcher: resolve returns null when it fails to find a matching route', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.use(hapimatcher);
  resolve.set([]);
  var result = resolve('foo', {name: 'bar'});
  t.equal(result, null);
  t.end();
});

test('alternative matcher: resolve resolves static route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.use(hapimatcher);
  resolve.set([{action:'foo',route:'/foo/bar'}]);
  var result = resolve('foo');
  t.equal(result, '/foo/bar');
  t.end();
});

test('alternative matcher: resolve resolves simple route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.use(hapimatcher);
  resolve.set([{action:'foo',route:'/foo/{name}'}]);
  var result = resolve('foo', {name: 'bar'});
  t.equal(result, '/foo/bar');
  t.end();
});

test('alternative matcher: resolve resolves optional route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.use(hapimatcher);
  resolve.set([{action:'foo',route:'/foo/{name?}'}]);
  var result = resolve('foo', {name: 'bar'});
  t.equal(result, '/foo/bar');
  t.end();
});

test('alternative matcher: resolve resolves missing optional route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.use(hapimatcher);
  resolve.set([{action:'foo',route:'/foo/{name?}'}]);
  var result = resolve('foo');
  t.equal(result, '/foo/');
  t.end();
});

test('alternative matcher: resolve throws for missing properties', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.use(hapimatcher);
  t.throws(function () {
    resolve.set([{action:'foo',route:'/foo/{name}'}]);
    resolve('foo');
  });
  t.end();
});

test('alternative matcher: resolve with extra arguments appends those as query string', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.use(hapimatcher);
  resolve.set([{action:'foo',route:'/foo'}]);
  var result = resolve('foo',{args:{a:'',b:2,c:false,d:null}});
  t.equal(result, '/foo?a&b=2&c=false&d');
  t.end();
});

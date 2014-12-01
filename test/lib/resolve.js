'use strict';

var test = require('tape');
var proxyquire = require('proxyquire');

test('resolve returns null when it fails to find a matching route', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  var result = resolve('foo', {name: 'bar'});
  t.equal(result, null);
  t.end();
});

test('resolve resolves static route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.set([{action:'foo',route:'/foo/bar'}]);
  var result = resolve('foo');
  t.equal(result, '/foo/bar');
  t.end();
});

test('resolve resolves simple route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.set([{action:'foo',route:'/foo/:name'}]);
  var result = resolve('foo', {name: 'bar'});
  t.equal(result, '/foo/bar');
  t.end();
});

test('resolve resolves falsy route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.set([{action:'foo',route:'/food/:id'}]);
  var result = resolve('foo', {id: 0});
  t.equal(result, '/food/0');
  t.end();
});

test('resolve resolves false route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.set([{action:'foo',route:'/food/:id'}]);
  var result = resolve('foo', {id: false});
  t.equal(result, '/food/false');
  t.end();
});

test('resolve resolves optional route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.set([{action:'foo',route:'/foo/:name?'}]);
  var result = resolve('foo', {name: 'bar'});
  t.equal(result, '/foo/bar');
  t.end();
});

test('resolve resolves missing optional route actions', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.set([{action:'foo',route:'/foo/:name?'}]);
  var result = resolve('foo');
  t.equal(result, '/foo/');
  t.end();
});

test('resolve throws for missing properties', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  t.throws(function () {
    resolve.set([{action:'foo',route:'/foo/:name'}]);
    resolve('foo');
  });
  t.end();
});

test('resolve with extra arguments appends those as query string', function (t) {
  var resolve = proxyquire('../../lib/resolve', {});
  resolve.set([{action:'foo',route:'/foo'}]);
  var result = resolve('foo',{args:{a:'',b:2,c:false,d:null}});
  t.equal(result, '/foo?a&b=2&c=false&d');
  t.end();
});

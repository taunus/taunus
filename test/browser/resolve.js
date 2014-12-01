'use strict';

var test = require('tape');

test('resolve returns null when it fails to find a matching route', function (t) {
  var resolve = require('../../browser/resolve');
  var result = resolve([],'foo', {name: 'bar'});
  t.equal(result, null);
  t.end();
});

test('resolve resolves static route actions', function (t) {
  var resolve = require('../../browser/resolve');
  var result = resolve([{action:'foo',route:'/foo/bar'}],'foo');
  t.equal(result, '/foo/bar');
  t.end();
});

test('resolve resolves simple route actions', function (t) {
  var resolve = require('../../browser/resolve');
  var result = resolve([{action:'foo',route:'/foo/:name'}],'foo', {name: 'bar'});
  t.equal(result, '/foo/bar');
  t.end();
});

test('resolve resolves optional route actions', function (t) {
  var resolve = require('../../browser/resolve');
  var result = resolve([{action:'foo',route:'/foo/:name?'}],'foo', {name: 'bar'});
  t.equal(result, '/foo/bar');
  t.end();
});

test('resolve resolves missing optional route actions', function (t) {
  var resolve = require('../../browser/resolve');
  var result = resolve([{action:'foo',route:'/foo/:name?'}],'foo');
  t.equal(result, '/foo/');
  t.end();
});

test('resolve throws for missing properties', function (t) {
  var resolve = require('../../browser/resolve');
  t.throws(function () {
    resolve([{action:'foo',route:'/foo/:name'}],'foo');
  });
  t.end();
});

test('resolve with extra arguments appends those as query string', function (t) {
  var resolve = require('../../browser/resolve');
  var result = resolve([{action:'foo',route:'/foo'}],'foo',{args:{a:'',b:2,c:false,d:null}});
  t.equal(result, '/foo?a&b=2&c=false&d');
  t.end();
});

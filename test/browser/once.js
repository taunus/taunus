'use strict';

var test = require('tape');
var sinon = require('sinon');

test('once returns a method', function (t) {
  var once = require('../../browser/once');
  var result = once(sinon.spy());
  t.equal(typeof result, 'function', 'once turns water into wine');
  t.end();
});

test('once only runs once', function (t) {
  var once = require('../../browser/once');
  var spy = sinon.spy();
  var result = once(spy);
  result();
  result();
  t.equal(spy.callCount, 1);
  t.end();
});

test('once always returns result', function (t) {
  var once = require('../../browser/once');
  var spy = sinon.stub().returns('foo');
  var result = once(spy);
  var a = result();
  var b = result();
  t.equal(a, 'foo');
  t.equal(b, 'foo');
  t.end();
});

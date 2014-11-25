'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('idb is missing and the store does not blow up in flames when setting', function (t) {
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': {}
  });
  var done = sinon.spy();
  store.set('foo','bar',{bat:'baz'},done);
  t.equal(store.name, 'IndexedDB-fallbackStore');
  t.ok(done.calledWith(null), 'called done(null)');
  t.end();
});

test('idb is missing and the store does not blow up in flames when reading', function (t) {
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': {}
  });
  var done = sinon.spy();
  store.get('foo','bar',done);
  t.ok(done.calledWith(null, null), 'called done(null, null)');
  t.end();
});

test('idb is missing and the store does not blow up in flames when reading all', function (t) {
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': {}
  });
  var done = sinon.spy();
  store.get('foo',done);
  t.ok(done.calledWith(null, []), 'called done(null, [])');
  t.end();
});

test('idb has tested method', function (t) {
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': {}
  });
  t.ok(typeof store.tested === 'function', 'tested is a method');
  t.end();
});

test('tested method calls back when support is false', function (t) {
  var done = sinon.spy();
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': {}
  });
  store.tested(done);
  t.ok(done.calledWith(false), 'test throws result: false');
  t.end();
});

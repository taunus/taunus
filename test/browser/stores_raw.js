'use strict';

var test = require('tape');
var sinon = require('sinon');

test('raw store stores stuff', function (t) {
  var store = require('../../browser/stores/raw');
  var done = sinon.spy();
  store.set('foo','bar','baz',done);
  t.equal(store.name, 'memoryStore');
  t.ok(done.calledWith(null));
  t.end();
});

test('raw store stores stuff without callback', function (t) {
  var store = require('../../browser/stores/raw');
  t.doesNotThrow(function () {
    store.set('foo','bar','baz');
  });
  t.end();
});

test('can pull stuff from raw store', function (t) {
  var store = require('../../browser/stores/raw');
  var got = sinon.spy();
  store.set('foo','bar','baz');
  store.get('foo','bar',got);
  t.ok(got.calledWith(null,'baz'));
  t.end();
});

test('pull just returns undefined for things that do not exist', function (t) {
  var store = require('../../browser/stores/raw');
  var got = sinon.spy();
  store.get('tar','tart',got);
  t.ok(got.calledWith(null,undefined));
  t.end();
});

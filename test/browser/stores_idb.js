'use strict';

function DEBUG () {
  console.log.apply(console, arguments);
}

global.DEBUG = DEBUG;
var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var idbEmpty = {};
var idb = {};

test('idb is missing and the store does not blow up in flames when setting', function (t) {
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': idbEmpty
  });
  var done = sinon.spy();
  store.set('foo','bar',{bat:'baz'},done);
  t.equal(store.name, 'IndexedDB-fallbackStore');
  t.ok(done.calledWith(null), 'called done(null)');
  t.end();
});

test('idb is missing and the store does not blow up in flames when reading', function (t) {
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': idbEmpty
  });
  var done = sinon.spy();
  store.get('foo','bar',done);
  t.ok(done.calledWith(null, null), 'called done(null, null)');
  t.end();
});

test('idb is missing and the store does not blow up in flames when reading all', function (t) {
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': idbEmpty
  });
  var done = sinon.spy();
  store.get('foo',done);
  t.ok(done.calledWith(null, []), 'called done(null, [])');
  t.end();
});

test('idb has tested method', function (t) {
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': idbEmpty
  });
  t.ok(typeof store.tested === 'function', 'tested is a method');
  t.end();
});

test('tested method calls back when support is false', function (t) {
  var done = sinon.spy();
  var store = proxyquire('../../browser/stores/idb', {
    './underlying_idb': idbEmpty
  });
  store.tested(done);
  t.ok(done.calledWith(false), 'test throws result: false');
  t.end();
});

// test('idb store stores stuff', function (t) {
//   var store = proxyquire('../../browser/stores/idb', {
//     './underlying_idb': idb
//   });
//   var done = sinon.spy();
//   store.set('foo','bar','baz',done);
//   t.equal(store.name, 'IndexedDB-fallbackStore');
//   t.ok(done.calledWith(null), 'called done(null)');
//   t.end();
// });

// test('idb store stores stuff without callback', function (t) {
//   var store = proxyquire('../../browser/stores/idb', {
//     './underlying_idb': idb
//   });
//   t.doesNotThrow(function () {
//     store.set('foo','bar','baz');
//   });
//   t.end();
// });

// test('can pull stuff from idb store', function (t) {
//   var store = proxyquire('../../browser/stores/idb', {
//     './underlying_idb': idb
//   });
//   var got = sinon.spy();
//   store.set('foo','bar','baz');
//   store.get('foo','bar',got);
//   t.ok(got.calledWith(null,'baz'));
//   t.end();
// });

// test('pull just returns undefined for things that do not exist', function (t) {
//   var store = proxyquire('../../browser/stores/idb', {
//     './underlying_idb': idb
//   });
//   var got = sinon.spy();
//   store.get('tar','tart',got);
//   t.ok(got.calledWith(null,undefined));
//   t.end();
// });

'use strict';

var test = require('tape');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

global.taunus = void 0; // because of how proxyquire works

test('index exposed globally', function (t) {
  t.notOk(global.taunus);
  var mocks = {
    './state': {},
    './stateClear': {},
    './interceptor': {},
    './activator': {go:{}},
    './emitter': {on:sinon.spy(),off:sinon.spy(),once:sinon.spy()},
    './hooks': {},
    './view': {partial:{}},
    './mount': {},
    './router': {},
    '../lib/resolve': {},
    './xhr': {},
    './prefetcher': {start:{}}
  };
  var index = proxyquire('../../browser', mocks);
  t.equal(global.taunus, index);
  t.end();
});

test('requiring index fails miserably when global exists', function (t) {
  global.taunus = {};
  var mocks = {
    './state': {},
    './stateClear': {},
    './interceptor': {},
    './activator': {go:{}},
    './emitter': {on:sinon.spy(),off:sinon.spy(),once:sinon.spy()},
    './hooks': {},
    './view': {partial:{}},
    './mount': {},
    './router': {},
    '../lib/resolve': {},
    './xhr': {},
    './prefetcher': {start:{}}
  };
  t.throws(function () {
    proxyquire('../../browser', mocks);
  });
  t.end();
});

test('index exposes API', function (t) {
  global.taunus = void 0;
  var mocks = {
    './state': {},
    './stateClear': {},
    './interceptor': {},
    './activator': {go:{}},
    './emitter': {on:sinon.spy(),off:sinon.spy(),once:sinon.spy()},
    './hooks': {},
    './view': {partial:{}},
    './mount': {},
    './router': {},
    '../lib/resolve': {},
    './xhr': {},
    './prefetcher': {start:{}}
  };
  var index = proxyquire('../../browser', mocks);
  t.equal(index.mount, mocks['./mount']);
  t.equal(index.partial, mocks['./view'].partial);
  t.equal(index.intercept, mocks['./interceptor'].add);
  t.equal(index.navigate, mocks['./activator'].go);
  t.equal(index.prefetch, mocks['./prefetcher'].start);
  t.equal(index.state, mocks['./state']);
  t.equal(index.route, mocks['./router']);
  t.equal(index.resolve, mocks['../lib/resolve']);
  t.equal(index.xhr, mocks['./xhr']);
  t.end();
});

test('emitter API is relayed', function (t) {
  global.taunus = void 0;
  var mocks = {
    './state': {},
    './stateClear': {},
    './interceptor': {},
    './activator': {go:{}},
    './emitter': {on:sinon.spy(),off:sinon.spy(),once:sinon.spy()},
    './hooks': {},
    './view': {partial:{}},
    './mount': {},
    './router': {},
    '../lib/resolve': {},
    './xhr': {},
    './prefetcher': {start:{}}
  };
  var emitter = mocks['./emitter'];
  var index = proxyquire('../../browser', mocks);
  index.on('foo', sinon.spy());
  t.ok(emitter.on.calledOn(emitter));
  t.ok(emitter.on.calledWith('foo'));
  index.once('foo', sinon.spy());
  t.ok(emitter.once.calledOn(emitter));
  t.ok(emitter.once.calledWith('foo'));
  index.off('foo');
  t.ok(emitter.off.calledOn(emitter));
  t.ok(emitter.off.calledWith('foo'));
  t.end();
});

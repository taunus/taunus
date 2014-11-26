'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('prefetcher exposes API', function (t) {
  var prefetcher = require('../../browser/prefetcher');
  t.ok(typeof prefetcher.busy === 'function');
  t.ok(typeof prefetcher.start === 'function');
  t.ok(typeof prefetcher.registerIntent === 'function');
  t.ok(typeof prefetcher.abortIntent === 'function');
  t.end();
});

test('prefetcher does not work when cache is off', function (t) {
  var route = {};
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './router': router,
    './fetcher': fetcher
  });
  prefetcher.start('/foo', {});
  t.ok(fetcher.notCalled);
  t.end();
});

test('prefetcher ignores non-routed URLs', function (t) {
  var route = null;
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var state = {
    cache: true
  };
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './router': router,
    './fetcher': fetcher,
    './state': state
  });
  prefetcher.start('/foo', {});
  t.ok(fetcher.notCalled);
  t.end();
});

test('prefetcher does not work when intent is set', function (t) {
  var route = {};
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var state = {
    cache: true
  };
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './router': router,
    './fetcher': fetcher,
    './state': state
  });
  prefetcher.registerIntent('/foo');
  prefetcher.start('/foo', {});
  t.ok(fetcher.notCalled);
  t.end();
});

test('prefetcher uses fetcher to prefetch', function (t) {
  var element = {};
  var route = {};
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var state = {
    cache: true
  };
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './router': router,
    './fetcher': fetcher,
    './state': state
  });
  prefetcher.start('/foo', element);
  t.ok(fetcher.calledWith(route, { element: element, source: 'prefetch' }, sinon.match.typeOf('function')));
  t.end();
});

test('second prefetch is ignored when busy', function (t) {
  var element = {};
  var route = {};
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var state = {
    cache: true
  };
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './router': router,
    './fetcher': fetcher,
    './state': state
  });
  prefetcher.start('/foo', element);
  prefetcher.start('/foo', element);
  t.equal(fetcher.callCount, 1);
  t.end();
});

test('prefetcher releases busyness after fetching', function (t) {
  var element = {};
  var route = {};
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var state = {
    cache: true
  };
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './router': router,
    './fetcher': fetcher,
    './state': state
  });
  prefetcher.start('/foo', element);
  t.ok(prefetcher.busy('/foo'));
  fetcher.firstCall.args[2]();
  t.notOk(prefetcher.busy('/foo'));
  t.end();
});

test('prefetcher only navigates if asked to', function (t) {
  var element = {};
  var route = {};
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var state = {
    cache: true
  };
  var activator = {
    go: sinon.spy()
  };
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './router': router,
    './fetcher': fetcher,
    './state': state,
    './activator': activator
  });
  prefetcher.start('/foo', element);
  fetcher.firstCall.args[2]();
  t.ok(activator.go.notCalled);
  t.end();
});

test('prefetcher navigates if asked to', function (t) {
  var element = {};
  var route = { url: '/foo' };
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var state = {
    cache: true
  };
  var activator = {
    go: sinon.spy()
  };
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './router': router,
    './fetcher': fetcher,
    './state': state,
    './activator': activator
  });
  prefetcher.start('/foo', element);
  prefetcher.registerIntent('/foo');
  fetcher.firstCall.args[2]();
  t.ok(activator.go.calledWith(route.url, { context: element }));
  t.end();
});

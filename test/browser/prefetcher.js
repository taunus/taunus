'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('prefetcher exposes API', function (t) {
  var prefetcher = require('../../browser/prefetcher');
  var prefetcherIntent = require('../../browser/prefetcherIntent');
  t.ok(typeof prefetcher.start === 'function');
  t.ok(typeof prefetcherIntent.is === 'function');
  t.ok(typeof prefetcherIntent.set === 'function');
  t.ok(typeof prefetcherIntent.abort === 'function');
  t.end();
});

test('prefetcher does not work when cache is off', function (t) {
  var route = {};
  var router = sinon.stub().returns(route);
  var fetcher = sinon.spy();
  var prefetcherIntent = proxyquire('../../browser/prefetcherIntent', {});
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './prefetcherIntent': prefetcherIntent,
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
  var prefetcherIntent = proxyquire('../../browser/prefetcherIntent', {});
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './prefetcherIntent': prefetcherIntent,
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
  var prefetcherIntent = proxyquire('../../browser/prefetcherIntent', {});
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './prefetcherIntent': prefetcherIntent,
    './router': router,
    './fetcher': fetcher,
    './state': state
  });
  prefetcherIntent.set('/foo');
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
  var prefetcherIntent = proxyquire('../../browser/prefetcherIntent', {});
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './prefetcherIntent': prefetcherIntent,
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
  var prefetcherIntent = proxyquire('../../browser/prefetcherIntent', {});
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './prefetcherIntent': prefetcherIntent,
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
  var prefetcherIntent = proxyquire('../../browser/prefetcherIntent', {});
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './prefetcherIntent': prefetcherIntent,
    './router': router,
    './fetcher': fetcher,
    './state': state
  });
  prefetcher.start('/foo', element);
  t.ok(prefetcherIntent.is('/foo'));
  fetcher.firstCall.args[2]();
  t.notOk(prefetcherIntent.is('/foo'));
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
  var prefetcherIntent = proxyquire('../../browser/prefetcherIntent', {});
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './prefetcherIntent': prefetcherIntent,
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
  var prefetcherIntent = proxyquire('../../browser/prefetcherIntent', {});
  var prefetcher = proxyquire('../../browser/prefetcher', {
    './prefetcherIntent': prefetcherIntent,
    './router': router,
    './fetcher': fetcher,
    './state': state,
    './activator': activator
  });
  prefetcher.start('/foo', element);
  prefetcherIntent.set('/foo');
  fetcher.firstCall.args[2]();
  t.ok(activator.go.calledWith(route.url, { context: element }));
  t.end();
});

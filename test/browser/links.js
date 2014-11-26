'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var document = global.document;

test('links exposes an API', function (t) {
  var links = require('../../browser/links');
  t.equal(typeof links, 'function');
  t.end();
});

test('links always adds clickjack', function (t) {
  var events = {
    add: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events
  });
  links();
  t.ok(events.add.calledWith(document.body, 'click', sinon.match.typeOf('function')));
  t.end();
});

test('links does not add prefetch handlers by default', function (t) {
  var events = {
    add: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events
  });
  links();
  t.notOk(events.add.calledWith(document.body, 'mouseover'));
  t.notOk(events.add.calledWith(document.body, 'touchstart'));
  t.end();
});

test('links does not add prefetch handlers when cache is falsy', function (t) {
  var events = {
    add: sinon.spy()
  };
  var state = {
    prefetch: true
  };
  var links = proxyquire('../../browser/links', {
    './events': events,
    './state': state
  });
  links();
  t.notOk(events.add.calledWith(document.body, 'mouseover'));
  t.notOk(events.add.calledWith(document.body, 'touchstart'));
  t.end();
});

test('links does not add prefetch handlers when prefetch is falsy', function (t) {
  var events = {
    add: sinon.spy()
  };
  var state = {
    cache: true
  };
  var links = proxyquire('../../browser/links', {
    './events': events,
    './state': state
  });
  links();
  t.notOk(events.add.calledWith(document.body, 'mouseover'));
  t.notOk(events.add.calledWith(document.body, 'touchstart'));
  t.end();
});

test('links adds prefetch handlers only when cache and prefetch are truthy', function (t) {
  var events = {
    add: sinon.spy()
  };
  var state = {
    prefetch: true,
    cache: true
  };
  var links = proxyquire('../../browser/links', {
    './events': events,
    './state': state
  });
  links();
  t.ok(events.add.calledWith(document.body, 'mouseover'));
  t.ok(events.add.calledWith(document.body, 'touchstart'));
  t.end();
});

test('links clickjacker ignores non-anchor elements', function (t) {
  var events = {
    add: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {tagName:'DIV'},
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(e.preventDefault.notCalled);
  t.end();
});

test('links clickjacker ignores CORS anchor elements', function (t) {
  var events = {
    add: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {
      tagName:'A',
      origin: 'foo'
    },
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(e.preventDefault.notCalled);
  t.end();
});

test('links clickjacker ignores non-left-clicks', function (t) {
  var events = {
    add: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {
      tagName: 'A',
      origin: document.location.origin,
      pathname: '/foo'
    },
    which: 0,
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(e.preventDefault.notCalled);
  t.end();
});

test('links clickjacker ignores meta-clicks', function (t) {
  var events = {
    add: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {
      tagName: 'A',
      origin: document.location.origin,
      pathname: '/foo'
    },
    which: 1,
    metaKey: true,
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(e.preventDefault.notCalled);
  t.end();
});

test('links clickjacker ignores routeless anchors', function (t) {
  var events = {
    add: sinon.spy()
  };
  var router = sinon.stub().returns(null);
  var links = proxyquire('../../browser/links', {
    './events': events,
    './router': router
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {
      tagName: 'A',
      origin: document.location.origin,
      pathname: '/foo',
      search: '',
      hash: ''
    },
    which: 1,
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(router.calledWith('/foo'));
  t.ok(e.preventDefault.notCalled);
  t.end();
});

test('links clicjacker prevents default', function (t) {
  var events = {
    add: sinon.spy()
  };
  var route = {};
  var router = sinon.stub().returns(route);
  var activator = {
    go: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events,
    './router': router,
    './activator': activator
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {
      tagName: 'A',
      origin: document.location.origin,
      pathname: '/foo',
      search: '',
      hash: ''
    },
    which: 1,
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(e.preventDefault.calledOnce);
  t.end();
});

test('links clickjacker yields to prefetcher first', function (t) {
  var events = {
    add: sinon.spy()
  };
  var route = {url:'/foo'};
  var router = sinon.stub().returns(route);
  var prefetcher = {
    busy: sinon.stub().returns(false)
  };
  var activator = {
    go: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events,
    './router': router,
    './prefetcher': prefetcher,
    './activator': activator
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {
      tagName: 'A',
      origin: document.location.origin,
      pathname: '/foo',
      search: '',
      hash: ''
    },
    which: 1,
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(prefetcher.busy.calledWith('/foo'));
  t.end();
});

test('links clickjacker signals prefetcher if prefetching', function (t) {
  var events = {
    add: sinon.spy()
  };
  var route = {url:'/foo'};
  var router = sinon.stub().returns(route);
  var prefetcher = {
    busy: sinon.stub().returns(true),
    registerIntent: sinon.spy()
  };
  var activator = {
    go: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events,
    './router': router,
    './prefetcher': prefetcher,
    './activator': activator
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {
      tagName: 'A',
      origin: document.location.origin,
      pathname: '/foo',
      search: '',
      hash: ''
    },
    which: 1,
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(prefetcher.registerIntent.calledWith('/foo'));
  t.ok(activator.go.notCalled);
  t.end();
});

test('links clickjacker goes if not prefetching', function (t) {
  var events = {
    add: sinon.spy()
  };
  var route = {url:'/foo'};
  var router = sinon.stub().returns(route);
  var prefetcher = {
    busy: sinon.stub().returns(false),
    registerIntent: sinon.spy()
  };
  var activator = {
    go: sinon.spy()
  };
  var links = proxyquire('../../browser/links', {
    './events': events,
    './router': router,
    './prefetcher': prefetcher,
    './activator': activator
  });
  links();
  var handler = events.add.firstCall.args[2];
  var e = {
    target: {
      tagName: 'A',
      origin: document.location.origin,
      pathname: '/foo',
      search: '',
      hash: ''
    },
    which: 1,
    preventDefault: sinon.spy()
  };
  handler(e);
  t.ok(prefetcher.registerIntent.notCalled);
  t.ok(activator.go.calledWith('/foo', { context: e.target }));
  t.end();
});

'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('activator exposes expected api', function (t) {
  var activator = proxyquire('../../browser/activator', {});
  t.equal(typeof activator.go, 'function', 'activator.go is a method');
  t.equal(typeof activator.start, 'function', 'activator.start is a method');
  t.end();
});

test('activator.start reloads on version mismatch', function (t) {
  var state = {
    version: '0',
    deferrals: []
  };
  var location = {
    href: '',
    reload: sinon.spy()
  };
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './global/location': location
  });
  activator.start({ version: '2' }),
  t.ok(location.reload.calledOnce);
  t.end();
});

test('activator.start emits start', function (t) {
  var state = {
    version: '0',
    container: {},
    deferrals: [],
    controllers: {},
    templates: {}
  };
  var emitter = {
    emit: sinon.spy()
  };
  var history = {
    replaceState: sinon.spy()
  };
  var view = sinon.spy();
  var route = {url:'/foo'};
  var router = sinon.stub().returns(route);
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './emitter': emitter,
    './router': router,
    './global/history': history,
    './view': view
  });
  var data = {
    version: '0',
    model: {title:'foo'}
  };
  activator.start(data);
  t.ok(emitter.emit.calledWith('start', state.container, data.model, route));
  t.ok(view.calledWith(state.container, null, data.model, route, { render: false }));
  t.ok(history.replaceState.calledWith({ model: data.model }, data.model.title, route.url));
  t.equal(state.route, route);
  t.deepEqual(state.model, data.model);
  t.equal(global.document.title, data.model.title);
  t.equal(typeof global.onpopstate, 'function');
  t.end();
});

test('activator.start uses onpopstate successfully', function (t) {
  var state = {
    version: '0',
    container: {},
    deferrals: [],
    controllers: {},
    templates: {}
  };
  var emitter = {
    emit: sinon.spy()
  };
  var history = {
    replaceState: sinon.spy()
  };
  var view = sinon.spy();
  var route = {url:'/foo',parts:{hash:'#far'}};
  var router = sinon.stub().returns(route);
  var el = {
    scrollIntoView: sinon.spy()
  };
  var document = {
    getElementById: sinon.stub().returns(el)
  };
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './emitter': emitter,
    './router': router,
    './global/history': history,
    './global/document': document,
    './view': view
  });
  var data = {
    version: '0',
    model: {title:'foo'}
  };
  var model = {foo:'bar'};
  activator.start(data);
  // reset spies expected to fire in .start
  view.reset();
  history.replaceState.reset();
  global.onpopstate();
  t.ok(view.notCalled);
  global.onpopstate({});
  t.ok(view.notCalled);
  global.onpopstate({state:{}});
  t.ok(view.notCalled);
  global.onpopstate({state:{model:model}});
  t.ok(history.replaceState.calledWith({model: model}, model.title, route.url));
  t.ok(view.calledWith(state.container, null, model, route));
  t.ok(document.getElementById.calledWith('far'));
  raf(function () {
    t.ok(el.scrollIntoView.calledOnce);
    t.end();
  });
});

test('activator.go bails if no route', function (t) {
  var router = sinon.stub().returns(null);
  var location = {
    href: ''
  };
  var activator = proxyquire('../../browser/activator', {
    './router': router,
    './global/location': location
  });
  activator.go('/foo');
  t.equal(location.href, '/foo');
  t.end();
});

test('activator.go bails if no route but it does not change location', function (t) {
  var router = sinon.stub().returns(null);
  var location = {
    href: ''
  };
  var activator = proxyquire('../../browser/activator', {
    './router': router,
    './global/location': location
  });
  activator.go('/foo', {strict:true});
  t.notEqual(location.href, '/foo');
  t.end();
});

test('activator.go bails if same route as before, after history push', function (t) {
  var route = {url:'/foo',parts:{hash:'#far'}};
  var router = sinon.stub().returns(route);
  router.equals = sinon.stub().returns(true);
  var state = {
    version: '0',
    container: {},
    deferrals: [],
    controllers: {},
    templates: {},
    model: {existing:true,title:'mart'}
  };
  var history = {
    pushState: sinon.spy()
  };
  var el = {
    scrollIntoView: sinon.spy()
  };
  var document = {
    getElementById: sinon.stub().returns(el)
  };
  var view = sinon.spy();
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './router': router,
    './view': view,
    './global/history': history,
    './global/document': document
  });
  activator.go('/foo');
  t.ok(view.notCalled);
  t.ok(history.pushState.calledWith({model:state.model},state.model.title,route.url));
  t.ok(document.getElementById.calledWith('far'));
  raf(function () {
    t.ok(el.scrollIntoView.calledOnce);
    t.end();
  });
});

test('activator.go bails if same route as before, after scroll nav', function (t) {
  var route = {url:'/foo',parts:{hash:'#bart'}};
  var router = sinon.stub().returns(route);
  router.equals = sinon.stub().returns(true);
  var state = {
    version: '0',
    container: {},
    deferrals: [],
    controllers: {},
    templates: {},
    model: {existing:true,title:'mart'}
  };
  var history = {
    pushState: sinon.spy()
  };
  var el = {
    scrollIntoView: sinon.spy()
  };
  var document = {
    getElementById: sinon.stub().returns(el)
  };
  var view = sinon.spy();
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './router': router,
    './global/document': document,
    './view': view,
    './global/history': history
  });
  activator.go('/foo');
  t.ok(document.getElementById.calledWith('bart'));
  raf(function () {
    t.ok(el.scrollIntoView.calledOnce);
    t.end();
  });
});

test('activator.go bails if same route as before, but re-renders if no hash', function (t) {
  var route = {url:'/foo',parts:{}};
  var router = sinon.stub().returns(route);
  router.equals = sinon.stub().returns(true);
  var state = {
    version: '0',
    container: {},
    deferrals: [],
    controllers: {},
    templates: {},
    model: {existing:true,title:'mart'}
  };
  var history = {
    pushState: sinon.spy()
  };
  var el = {
    scrollIntoView: sinon.spy()
  };
  var document = {
    getElementById: sinon.stub().returns(el)
  };
  var view = sinon.spy();
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './router': router,
    './global/document': document,
    './view': view,
    './global/history': history
  });
  activator.go('/foo');
  t.ok(view.calledWith(state.container,null,state.model,route));
  t.end();
});

test('even on diff route, activator.go bails if not modern browser', function (t) {
  var history = {
    modern: false
  };
  var location = {
    href: ''
  };
  var route = {url:'/foo',parts:{},route:'/foo'};
  var router = sinon.stub().returns(route);
  var state = {
    version: '0',
    container: {},
    deferrals: [],
    controllers: {},
    templates: {},
    model: {existing:true,title:'mart'}
  };
  router.equals = sinon.stub().returns(false);
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './router': router,
    './global/location': location,
    './global/history': history
  });
  activator.go('/foo');
  t.equal(location.href, '/foo');
  t.end();
});

test('happy path bails on bad version', function (t) {
  var history = {
    pushState: sinon.spy()
  };
  var location = {
    href: ''
  };
  var route = {url:'/foo',parts:{},route:'/foo'};
  var router = sinon.stub().returns(route);
  router.equals = sinon.stub().returns(false);
  var state = {
    version: '0',
    container: {},
    deferrals: [],
    controllers: {},
    templates: {},
    model: {existing:true,title:'mart'}
  };
  var prefetcher = {abortIntent: sinon.spy()};
  var fetcher = sinon.spy();
  fetcher.abortPending = sinon.spy();
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './router': router,
    './global/location': location,
    './global/history': history,
    './prefetcher': prefetcher,
    './fetcher': fetcher
  });
  var context = {};
  activator.go('/foo', {context:context});
  t.ok(prefetcher.abortIntent.calledOnce);
  t.ok(fetcher.abortPending.calledOnce);
  t.ok(fetcher.calledWith(route, { element: context, source: 'intent' }, sinon.match.typeOf('function')));
  fetcher.firstCall.args[2](null, {version: '2'});
  t.equal(location.href, '/foo');
  t.end();
});

test('happy path goes ahead on version match', function (t) {
  var history = {
    pushState: sinon.spy()
  };
  var location = {
    href: ''
  };
  var document = {
    getElementById: sinon.spy(),
    documentElement: {
      scrollIntoView: sinon.spy()
    }
  };
  var route = {url:'/foo',parts:{},route:'/foo'};
  var router = sinon.stub().returns(route);
  router.equals = sinon.stub().returns(false);
  var state = {
    version: '0',
    container: {},
    deferrals: [],
    controllers: {},
    templates: {},
    model: {existing:true,title:'mart'}
  };
  var view = sinon.spy();
  var prefetcher = {abortIntent: sinon.spy()};
  var fetcher = sinon.spy();
  fetcher.abortPending = sinon.spy();
  var activator = proxyquire('../../browser/activator', {
    './state': state,
    './router': router,
    './global/document': document,
    './global/location': location,
    './global/history': history,
    './prefetcher': prefetcher,
    './fetcher': fetcher,
    './view': view
  });
  var data = {version: '0',model:{title:'kwik-e-mart'}};
  activator.go('/foo');
  fetcher.firstCall.args[2](null, data);
  t.ok(history.pushState.calledWith({model:data.model},data.model.title,route.url));
  t.ok(view.calledWith(state.container,null,data.model,route));
  t.ok(document.getElementById.notCalled);
  raf(function () {
    t.ok(document.documentElement.scrollIntoView.calledOnce);
    t.end();
  });
});

function raf (fn) {
  setTimeout(fn, 50); // for some reason the regular raf method fails miserably on phantomjs
}

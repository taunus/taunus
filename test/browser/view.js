'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('view exposes a couple of methods', function (t) {
  var view = require('../../browser/view');
  t.ok(view);
  t.ok(typeof view === 'function', 'view is a method');
  t.ok(typeof view.partial === 'function', 'view.partial is a method');
  t.end();
});

test('view renders a view', function (t) {
  var templ = 'ha ha';
  var state = {
    templates: {foo: sinon.stub().returns(templ)},
    controllers: {foo: sinon.spy()},
    deferrals: []
  };
  var view = proxyquire('../../browser/view', {
    './state': state
  });
  var container = {};
  var model = {};
  view(container, 'foo', model);
  t.ok(state.templates.foo.calledWith(model));
  t.ok(state.controllers.foo.calledWith(model,container,null));
  t.equal(container.innerHTML, templ);
  t.end();
});

test('view renders a view ignoring missing controller', function (t) {
  var state = {
    templates: {foo: sinon.spy()},
    controllers: {},
    deferrals: []
  };
  var view = proxyquire('../../browser/view', {
    './state': state
  });
  var container = {};
  var model = {};
  view(container, 'foo', model);
  t.ok(state.templates.foo.calledWith(model));
  t.end();
});

test('view emits render event', function (t) {
  var state = {
    templates: {foo: sinon.spy()},
    controllers: {},
    deferrals: []
  };
  var emitter = {
    emit: sinon.spy()
  };
  var view = proxyquire('../../browser/view', {
    './state': state,
    './emitter': emitter
  });
  var container = {};
  var model = {};
  view(container, 'foo', model);
  t.ok(emitter.emit.calledWith('render', container, model, null));
  t.end();
});

test('view emits change event if matched state.container', function (t) {
  var container = {};
  var state = {
    templates: {foo: sinon.spy()},
    controllers: {},
    deferrals: [],
    container: container
  };
  var emitter = {
    emit: sinon.spy()
  };
  var route = {};
  var view = proxyquire('../../browser/view', {
    './state': state,
    './emitter': emitter
  });
  var model = {};
  view(container, 'foo', model, route);
  t.ok(emitter.emit.calledWith('change', route, model));
  t.end();
});

test('view internals allow to ignore rendering', function (t) {
  var state = {
    templates: {foo: sinon.spy()},
    controllers: {},
    deferrals: []
  };
  var emitter = {
    emit: sinon.spy()
  };
  var view = proxyquire('../../browser/view', {
    './state': state,
    './emitter': emitter
  });
  var container = {};
  var model = {};
  view(container, 'foo', model,null,{render:false});
  t.ok(state.templates.foo.notCalled);
  t.end();
});

test('deferrals can complicate things but that is okay', function (t) {
  var container = {};
  var state = {
    templates: {foo: sinon.spy()},
    controllers: {},
    deferrals: ['?'],
    container: container
  };
  var fetcher = sinon.spy();
  var emitter = {
    emit: sinon.spy()
  };
  var route = {};
  var view = proxyquire('../../browser/view', {
    './state': state,
    './emitter': emitter,
    './fetcher': fetcher
  });
  var model = {};
  view(container, 'foo', model, route);
  t.ok(fetcher.calledWith(route, {
    source: 'hijacking',
    hijacker: 'foo',
    element: container
  }));
  state.templates.foo = sinon.spy(); //mock fetcher results
  fetcher.firstCall.args[2]();
  t.ok(state.templates.foo.called);
  t.end();
});

test('when hijacker has no route, fallback to state.route', function (t) {
  var route = {};
  var container = {};
  var state = {
    templates: {foo: sinon.spy()},
    controllers: {},
    deferrals: ['?'],
    container: container,
    route: route
  };
  var fetcher = sinon.spy();
  var emitter = {
    emit: sinon.spy()
  };
  var view = proxyquire('../../browser/view', {
    './state': state,
    './emitter': emitter,
    './fetcher': fetcher
  });
  var model = {};
  view(container, 'foo', model);
  t.ok(fetcher.calledWith(route, {
    source: 'hijacking',
    hijacker: 'foo',
    element: container
  }));
  state.templates.foo = sinon.spy(); //mock fetcher results
  fetcher.firstCall.args[2]();
  t.ok(state.templates.foo.called);
  t.end();
});

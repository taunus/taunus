'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var emitter = require('contra/emitter');

test('interceptor exposes API', function (t) {
  var interceptor = require('../../browser/interceptor');
  t.ok(typeof interceptor.add === 'function');
  t.ok(typeof interceptor.execute === 'function');
  t.end();
});

test('interceptor adds action interceptors to emitter', function (t) {
  var emspy = { count: 0, on: sinon.spy() };
  var emit = sinon.stub().returns(emspy);
  var interceptor = proxyquire('../../browser/interceptor', {
    'contra/emitter': emit
  });
  var fn = sinon.spy();
  interceptor.add('foo', fn);
  t.equal(emspy.count, 1);
  t.ok(emspy.on.calledWith('foo', fn));
  t.end();
});

test('interceptor adds global interceptors to emitter', function (t) {
  var emspy = { count: 0, on: sinon.spy() };
  var emit = sinon.stub().returns(emspy);
  var interceptor = proxyquire('../../browser/interceptor', {
    'contra/emitter': emit
  });
  var fn = sinon.spy();
  interceptor.add(fn);
  t.equal(emspy.count, 1);
  t.ok(emspy.on.calledWith('*', fn));
  t.end();
});

test('interceptor can execute without mediators', function (t) {
  var emspy = { count: 0, on: sinon.spy(), emit: sinon.spy() };
  var emit = sinon.stub().returns(emspy);
  var interceptor = proxyquire('../../browser/interceptor', {
    'contra/emitter': emit
  });
  var route = {url:'/foo'};
  var done = sinon.spy();
  interceptor.execute(route, done);
  t.ok(done.calledWith(null, {
    url: '/foo',
    route: route,
    data: null,
    canPreventDefault: false,
    defaultPrevented: false,
    preventDefault: sinon.match.typeOf('function')
  }));
  t.end();
});

test('interceptor.execute notifies listeners', function (t) {
  var emspy = { count: 0, on: sinon.spy(), emit: sinon.spy() };
  var emit = sinon.stub().returns(emspy);
  var interceptor = proxyquire('../../browser/interceptor', {
    'contra/emitter': emit
  });
  var route = {action: 'foo',url:'/foo'};
  var done = sinon.spy();
  var fn = sinon.spy();
  interceptor.add(fn);
  interceptor.execute(route, done);
  t.ok(emspy.emit.calledWith('*'));
  t.ok(emspy.emit.calledWith(route.action));
  t.end();
});

test('interceptor.execute returns prevented result', function (t) {
  var interceptor = proxyquire('../../browser/interceptor', {});
  var route = {action: 'foo',url:'/foo'};
  var data = {foo:'bar'};
  interceptor.add(fn);
  interceptor.execute(route, done);
  function fn (e) {
    e.preventDefault(data);
  }
  function done (err, e) {
    t.notOk(err);
    t.equal(e.defaultPrevented, true);
    t.equal(e.data, data);
    t.end();
  }
});

test('interceptor.execute returns even when never prevented', function (t) {
  var interceptor = proxyquire('../../browser/interceptor', {});
  var route = {action: 'foo',url:'/foo'};
  interceptor.add(fn);
  interceptor.execute(route, done);
  function fn (e) {
    // taking so long. I don't even ...
  }
  function done (err, e) {
    t.notOk(err);
    t.equal(e.defaultPrevented, false);
    t.equal(e.data, null);
    t.end();
  }
});

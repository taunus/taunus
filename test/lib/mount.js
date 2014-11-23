'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var pkg = require('../../package.json');

test('mount emits defaults', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var mount = proxyquire('../../lib/mount', { './state': state });
  mount();
  t.ok(state.emit.calledWith('defaults'), '"defaults" event emitted');
  t.ok(state.defaults, 'defaults is an object');
  t.end();
});

test('mount sets version properly', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var mount = proxyquire('../../lib/mount', { './state': state });
  mount();
  t.equal(state.version, 't' + pkg.version + ';v1', 'state.version is okay');
  t.end();
});

test('mount uses provided version', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var mount = proxyquire('../../lib/mount', { './state': state });
  mount(null, { version: 2 });
  t.equal(state.version, 't' + pkg.version + ';v2', 'state.version is okay');
  t.end();
});

test('mount sets state properties', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var mount = proxyquire('../../lib/mount', { './state': state });
  var opt = { plaintext: {}, deferMinified: true, getPartial: function () {}, layout: function () {} };
  mount(null, opt);
  t.equal(state.plaintext, opt.plaintext, 'plaintext is used');
  t.equal(state.deferMinified, opt.deferMinified, 'deferMinified is used');
  t.equal(state.getPartial, opt.getPartial, 'getPartial is used');
  t.equal(state.layout, opt.layout, 'layout is used');
  t.end();
});

test('mount uses getDefaultViewModel', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var model = {};
  function getDefaultViewModel (done) {
    done(null, model);
  }
  var mount = proxyquire('../../lib/mount', { './state': state });
  mount(null, {getDefaultViewModel: getDefaultViewModel});
  t.ok(state.emit.calledWith('defaults'), '"defaults" event emitted');
  t.equal(state.defaults, model);
  t.end();
});

test('mount throws on getDefaultViewModel error', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var model = {};
  function getDefaultViewModel (done) {
    done('haha', model);
  }
  var mount = proxyquire('../../lib/mount', { './state': state });
  t.throws(function () {
    mount(null, {getDefaultViewModel: getDefaultViewModel});
  }, 'a failed getDefaultViewModel throws an error');
  t.notOk(state.emit.calledWith('defaults'), '"defaults" event not emitted');
  t.equal(state.defaults, undefined);
  t.end();
});

test('mount throws on getDefaultViewModel error', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var model = {};
  function getDefaultViewModel (done) {
    done('haha', model);
  }
  var mount = proxyquire('../../lib/mount', { './state': state });
  t.throws(function () {
    mount(null, {getDefaultViewModel: getDefaultViewModel});
  }, 'a failed getDefaultViewModel throws an error');
  t.notOk(state.emit.calledWith('defaults'), '"defaults" event not emitted');
  t.equal(state.defaults, undefined);
  t.end();
});

test('mount exposes rebuildDefaultViewModel after invoking it', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var mount = proxyquire('../../lib/mount', { './state': state });
  t.notOk('rebuildDefaultViewModel' in mount, 'rebuildDefaultViewModel is not a property of mount');
  mount();
  t.ok('rebuildDefaultViewModel' in mount, 'rebuildDefaultViewModel is a property of mount');
  t.end();
});

test('routes get added one by one at the mountpoint', function (t) {
  var state = {
    emit: sinon.spy()
  };
  var addRoute = sinon.spy();
  var ctrl = sinon.spy();
  var ctrlTwo = sinon.spy();
  var ctrlThree = sinon.spy();
  var stubs = {
    '../controllers/foo/bar': ctrl,
    '../controllers/baz/baz': ctrlTwo,
    '../controllers/baz/boo': ctrlThree
  };
  var mw = sinon.spy();
  function optionalRequire (what) {
    return stubs[what];
  }
  var routes = [{ignore:true}, {action:'foo/bar'}, { not: 'cool' }, {action: 'baz/baz', middleware:mw}, {action: 'baz/boo', middleware:[mw]}];
  var mount = proxyquire('../../lib/mount', { './state': state, './optionalRequire': optionalRequire });
  mount(addRoute, {routes:routes});
  t.equal(addRoute.callCount, routes.length - 2, 'called once for each unignored route');
  t.ok(addRoute.firstCall.calledWith(routes[1]), 'called first with second route');
  t.equal(routes[1].actionFn, ctrl, 'actionFn matches controller');
  t.deepEqual(routes[1].middleware, [], 'middleware are empty');
  t.ok(addRoute.secondCall.calledWith(routes[3]), 'called second with fourth route');
  t.equal(routes[3].actionFn, ctrlTwo, 'actionFn matches controller');
  t.deepEqual(routes[3].middleware, [mw], 'middleware are assigned');
  t.ok(addRoute.thirdCall.calledWith(routes[4]), 'called third with fifth route');
  t.equal(routes[4].actionFn, ctrlThree, 'actionFn matches controller');
  t.deepEqual(routes[4].middleware, [mw], 'middleware are assigned');
  t.end();
});

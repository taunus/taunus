'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('componentCache does not store undeferred stuff', function (t) {
  var state = {
    version: '1',
    deferrals: [],
    controllers: {},
    templates: {}
  };
  var componentCache = proxyquire('../../browser/componentCache', {
    './state': state
  });
  componentCache.set('foo', {controller:'function(){}',version:'1'});
  t.notOk(state.controllers.foo, 'state.controllers does not have foo');
  t.end();
});

test('componentCache stores deferred controllers', function (t) {
  var state = {
    version: '1',
    deferrals: ['?'],
    controllers: {},
    templates: {}
  };
  var componentCache = proxyquire('../../browser/componentCache', {
    './state': state
  });
  componentCache.set('foo', {controller:'(function(){return function(){}})()',version:'1'});
  t.ok(state.controllers.foo, 'state.controllers has foo');
  t.equal(typeof state.controllers.foo.fn, 'function', 'foo.fn is function');
  t.equal(state.controllers.foo.version, state.version, 'version matches');
  t.end();
});

test('componentCache stores deferred templates', function (t) {
  var state = {
    version: '1',
    deferrals: ['?'],
    controllers: {},
    templates: {}
  };
  var componentCache = proxyquire('../../browser/componentCache', {
    './state': state
  });
  componentCache.set('foo', {template:'(function(){return function(){}})()',version:'1'});
  t.ok(state.templates.foo, 'state.templates has foo');
  t.equal(typeof state.templates.foo.fn, 'function', 'foo.fn is function');
  t.equal(state.templates.foo.version, state.version, 'version matches');
  t.end();
});

test('componentCache fails amicably for invalid methods', function (t) {
  var state = {
    version: '1',
    deferrals: ['?'],
    controllers: {},
    templates: {}
  };
  var componentCache = proxyquire('../../browser/componentCache', {
    './state': state
  });
  componentCache.set('foo', {template:'not something you can eval',version:'1'});
  t.ok(state.templates.foo, 'state.templates has foo');
  t.equal(state.templates.foo.fn, undefined, 'foo.fn is undefined');
  t.equal(state.templates.foo.version, state.version, 'version matches');
  t.end();
});


test('componentCache can refill from persistant storage', function (t) {
  var state = {
    version: '1',
    deferrals: ['?'],
    controllers: {},
    templates: {}
  };
  var caching = {
    ready: ready
  };
  var idb = {
    get: get
  };
  var mocks = {
    controllers: { err: null, items: [{
      key: 'bar', data: '(function(){return function(){}})()', version:'1'
    }]},
    templates: { err: null, items: [{
      key: 'tar', data: '(function(){return function(){}})()', version:'1'
    }]}
  };
  var componentCache = proxyquire('../../browser/componentCache', {
    './state': state,
    './caching': caching,
    './stores/idb': idb
  });
  function ready (cb) {
    cb(true);
  }
  function get (type, cb) {
    cb(mocks[type].err, mocks[type].items);
  }
  componentCache.refill();
  t.ok(state.controllers.bar, 'state.controllers has bar');
  t.equal(typeof state.controllers.bar.fn, 'function', 'bar.fn is undefined');
  t.equal(state.controllers.bar.version, state.version, 'version matches');
  t.ok(state.templates.tar, 'state.templates has tar');
  t.equal(typeof state.templates.tar.fn, 'function', 'tar.fn is undefined');
  t.equal(state.templates.tar.version, state.version, 'version matches');
  t.end();
});

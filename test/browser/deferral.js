'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('deferral has needs', function (t) {
  var deferral = require('../../browser/deferral');
  t.ok(deferral.needs);
  t.ok(typeof deferral.needs === 'function');
  t.end();
});

test('deferral uses deferred test', function (t) {
  var state = {
    version: '1',
    controllers: {},
    templates: {},
    deferrals: ['?']
  };
  var deferred = sinon.stub().returns(true);
  var deferral = proxyquire('../../browser/deferral', {
    './state': state,
    '../lib/deferred': deferred
  });
  var result = deferral.needs('foo');
  t.ok(deferred.calledWith('foo', state.deferrals));
  t.end();
});

test('deferral matches needs for action', function (t) {
  var state = {
    version: '1',
    controllers: {},
    templates: {},
    deferrals: ['?']
  };
  var deferral = proxyquire('../../browser/deferral', {
    './state': state
  });
  var result = deferral.needs('foo');
  t.deepEqual(result, ['template','controller']);
  t.end();
});

test('deferral does not need undeferred actions', function (t) {
  var state = {
    version: '1',
    controllers: {},
    templates: {},
    deferrals: []
  };
  var deferral = proxyquire('../../browser/deferral', {
    './state': state
  });
  var result = deferral.needs('foo');
  t.deepEqual(result, []);
  t.end();
});

test('deferral does need only the template sometimes', function (t) {
  var state = {
    version: '1',
    controllers: {foo:{version: '1'}},
    templates: {},
    deferrals: ['?']
  };
  var deferral = proxyquire('../../browser/deferral', {
    './state': state
  });
  var result = deferral.needs('foo');
  t.deepEqual(result, ['template']);
  t.end();
});

test('deferral does need only the controller sometimes', function (t) {
  var state = {
    version: '1',
    controllers: {},
    templates: {foo:{version: '1'}},
    deferrals: ['?']
  };
  var deferral = proxyquire('../../browser/deferral', {
    './state': state
  });
  var result = deferral.needs('foo');
  t.deepEqual(result, ['controller']);
  t.end();
});

test('deferral has everything sometimes', function (t) {
  var state = {
    version: '1',
    controllers: {foo:{version: '1'}},
    templates: {foo:{version: '1'}},
    deferrals: ['?']
  };
  var deferral = proxyquire('../../browser/deferral', {
    './state': state
  });
  var result = deferral.needs('foo');
  t.deepEqual(result, []);
  t.end();
});

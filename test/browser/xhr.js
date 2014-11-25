'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('calls xhr module', function (t) {
  var done = sinon.spy();
  var spy = sinon.stub().returns({getAllResponseHeaders: sinon.stub().returns(false)});
  var xhr = proxyquire('../../browser/xhr', {
    'xhr': spy
  });
  xhr('/foo', done);
  t.ok(spy.calledWith({
    url:'/foo',
    json:true,
    headers: { Accept: 'application/json' }}));
  t.end();
});

test('swaps arguments around', function (t) {
  var done = sinon.spy();
  var spy = sinon.stub().returns({getAllResponseHeaders: sinon.stub().returns(false)});
  var xhr = proxyquire('../../browser/xhr', {
    'xhr': spy
  });
  xhr('/foo', done);
  spy.firstCall.args[1](false, 'b', 'c');
  t.ok(done.calledWith(false, 'c', 'b'));
  t.end();
});

test('hijacks abort', function (t) {
  var done = sinon.spy();
  var spy = sinon.stub().returns({getAllResponseHeaders: sinon.stub().returns(false)});
  var xhr = proxyquire('../../browser/xhr', {
    'xhr': spy
  });
  xhr('/foo', done);
  spy.firstCall.args[1]('grumble', 'b', 'c');
  t.ok(done.firstCall.args[0] instanceof Error);
  t.equal(done.firstCall.args[0].message, 'aborted');
  t.end();
});

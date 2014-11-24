'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('render without layout gets some html anyways', function (t) {
  var state = {
    defaults: {},
    getPartial: function (action, vm, done) { done(null,'action:' + action + ',vm:' + JSON.stringify(vm)); }
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = sinon.spy();
  var req = {
    headers: {
      accept: 'text/html'
    },
    query: {}
  };
  var res = {
    set: sinon.spy(),
    send: sinon.spy()
  };
  function next () {}
  render('foo/bar', vm, req, res, next);
  t.ok(res.send.calledOnce, 'called res.send');
  t.deepEqual(res.send.firstCall.args, ['<pre><code>{\n  "model": {},\n  "partial": "action:foo/bar,vm:{}"\n}</code></pre>'], 'got html response anyways');
  t.end();
});

test('render sets cache headers', function (t) {
  var state = {
    defaults: {},
    getPartial: function (action, vm, done) { done(null,'action:' + action + ',vm:' + JSON.stringify(vm)); }
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = sinon.spy();
  var req = {
    url: '/foo',
    headers: {
      accept: 'text/html'
    },
    query: {}
  };
  var res = {
    set: sinon.spy(),
    send: sinon.spy()
  };
  function next () {}
  render('foo/bar', vm, req, res, next);
  t.ok(res.set.calledWith('Vary', 'Accept'), 'vary accept header');
  t.ok(res.set.calledWith('ETag'), 'etag header');
  t.ok(res.set.calledWith('cache-control', 'private, must-revalidate, max-age=0'), 'cache control header');
  t.end();
});

test('render JSON just gets json', function (t) {
  var state = {
    defaults: {}, // set at mountpoint
    version: '1' // set at mountpoint
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = sinon.spy();
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {}
  };
  var res = {
    set: sinon.spy(),
    json: json
  };
  function next () {}
  render('foo/bar', vm, req, res, next);
  function json (data) {
    t.deepEqual(data, { model: {}, version: '1' });
    t.end();
  }
});

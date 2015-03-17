'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('redirect works normally', function (t) {
  var state = {
    defaults: {}
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var redirect = proxyquire('../../lib/redirect', {
    './render': render
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'text/html'
    },
    query: {},
    params: {}
  };
  var res = {
    redirect: sinon.spy()
  };
  function next () {}
  var url = '/foo';
  redirect(req, res, '/foo');
  t.ok(res.redirect.calledWith(url), 'called res.redirect');
  t.end();
});

test('redirect works for json responses', function (t) {
  var state = {
    defaults: {}, version: '2a'
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var redirect = proxyquire('../../lib/redirect', {
    './render': render
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {},
    params: {},
    url: '/bar'
  };
  var res = {
    set: sinon.spy(),
    json: sinon.spy()
  };
  function next () {}
  var url = '/foo';
  redirect(req, res, '/foo');
  t.ok(res.json.calledOnce, 'called res.json');
  t.deepEqual(res.json.firstCall.args[0], { version: '2a', redirect: { href: url, hard: false, force: false } }, 'called res.json');
  t.end();
});

test('redirect works for json responses and can be hard too', function (t) {
  var state = {
    defaults: {}, version: '2a'
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var redirect = proxyquire('../../lib/redirect', {
    './render': render
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {},
    params: {},
    url: '/bar'
  };
  var res = {
    set: sinon.spy(),
    json: sinon.spy()
  };
  function next () {}
  var url = '/foo';
  redirect(req, res, '/foo', { hard: true });
  t.ok(res.json.calledOnce, 'called res.json');
  t.deepEqual(res.json.firstCall.args[0], { version: '2a', redirect: { href: url, hard: true, force: false } }, 'called res.json');
  t.end();
});

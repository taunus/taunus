'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('hooks attaches event on links', function (t) {
  var links = sinon.spy();
  var emitter = {
    on: sinon.spy()
  };
  var hooks = proxyquire('../../browser/hooks', {
    './emitter': emitter,
    './links': links
  });
  t.ok(typeof hooks.attach === 'function', 'hooks.attach is a method');
  hooks.attach();
  emitter.on.calledWith('start', links);
  t.end();
});

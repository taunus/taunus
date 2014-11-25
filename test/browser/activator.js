'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('activator exposes expected api', function (t) {
  var activator = require('../../browser/activator');
  t.equal(typeof activator.go, 'function', 'activator.go is a method');
  t.equal(typeof activator.start, 'function', 'activator.start is a method');
  t.end();
});

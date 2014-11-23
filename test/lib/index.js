'use strict';

var test = require('tape');
var proxyquire = require('proxyquire');

test('index exports expected props', function (t) {
  var index = proxyquire('../../lib/index', {
    './mount': mount,
    './render': render
  });
  function mount () {}
  function render () {}
  t.ok(typeof index.mount === 'function');
  t.ok(typeof index.render === 'function');
  t.ok(typeof index.rebuildDefaultViewModel === 'function');
  t.end();
});

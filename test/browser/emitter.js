'use strict';

var test = require('tape');

test('emitter has expected methods', function (t) {
  var emitter = require('../../browser/emitter');
  t.ok(typeof emitter.on === 'function');
  t.ok(typeof emitter.once === 'function');
  t.ok(typeof emitter.off === 'function');
  t.ok(typeof emitter.emit === 'function');
  t.end();
});

test('emitter does not throw', function (t) {
  var emitter = require('../../browser/emitter');
  t.doesNotThrow(function () {
    emitter.emit('error');
  });
  t.end();
});

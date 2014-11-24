'use strict';

var test = require('tape');

test('clones objects naïvely', function (t) {
  var clone = require('../../browser/clone');
  t.deepEqual({a:1, b:{c: 3, d: 'f00'}}, clone({a:1, b:{c: 3, d: 'f00'}}));
  t.end();
});

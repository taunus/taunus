'use strict';

var test = require('tape');

test('unescape unescapes things', function (t) {
  var unescape = require('../../browser/unescape');
  t.equal(unescape('&lt;div&gt;'), '<div>', 'unescape works its magic');
  t.end();
});

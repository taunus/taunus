'use strict';

var fs = require('fs');
var test = require('tape');
var proxyquire = require('proxyquire');

test('browserifies foo.js', function (t) {
  var bro = require('../../lib/bro');

  bro('./test/lib/fixture/foo.js', function (err, result) {
    t.notOk(err, 'error should be falsy');
    t.equal(result + '\n', read('./test/lib/fixture/foo.expect'));
    t.end();
  });
});

test('browserifies foo.js and minifies', function (t) {
  var bro = proxyquire('../../lib/bro', {
    './state': { deferMinified: true }
  });
  bro('./test/lib/fixture/foo.js', function (err, result) {
    t.notOk(err, 'error should be falsy');
    t.equal(result + '\n', read('./test/lib/fixture/foo.expect.min'));
    t.end();
  });
});

function read (file) {
  return fs.readFileSync(file, 'utf8');
}

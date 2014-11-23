'use strict';

var test = require('tape');

test('negotiates content type', function (t) {
  var accepts = require('../../lib/accepts');
  t.equal(accepts({headers:{accept:'text/plain'}}), 'text');
  t.equal(accepts({headers:{accept:'text/html'}}), 'html');
  t.equal(accepts({headers:{accept:'*/*'}}), 'html');
  t.equal(accepts({headers:{accept:'application/json'}}), 'json');
  t.end();
});

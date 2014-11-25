'use strict';

var test = require('tape');

test('unstrictEval evals text', function (t) {
  var unstrictEval = require('../../browser/unstrictEval');
  var result = unstrictEval('(function(){return function(){}})()');
  t.equal(typeof result, 'function', 'unstrictEval turns water into wine');
  t.end();
});

test('unstrictEval ignores strict mode', function (t) {
  var unstrictEval = require('../../browser/unstrictEval');
  var result = unstrictEval('(function(){return exports=function(){}})()');
  t.equal(typeof result, 'function', 'unstrictEval doesnt care about strict mode');
  t.end();
});

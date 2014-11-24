'use strict';

var test = require('tape');
var actions = [
  'home/index',
  'home/about',
  'admin/index',
  'admin/nuke',
  'admin/ban',
  'admin/superuser',
  'articles/one',
  'articles/index',
  'articles/all'
];
var cases = {
  'defers all the things': {
    rules: ['?'],
    deferred: actions
  },
  'defer all the admins': {
    rules: ['admin'],
    deferred: actions.filter(function (a) { return a.indexOf('admin')===0;})
  },
  'defer all the index': {
    rules: ['?/index'],
    deferred: actions.filter(function (a) { return a.indexOf('index')!==-1;})
  },
  'defer nothing': {
    rules: ['index'],
    deferred: []
  },
  'defer nothing 2': {
    rules: ['home/about/car'],
    deferred: []
  },
  'defer only this one': {
    rules: ['home/about'],
    deferred: ['home/about']
  },
  'defer only this one 2': {
    rules: ['home/index'],
    deferred: ['home/index']
  }
};

Object.keys(cases).forEach(function register (tc) {
  test(tc, testCase);

  function testCase (t) {
    var deferred = require('../../lib/deferred');
    cases[tc].deferred.forEach(function deferreds (action) {
      t.ok(deferred(action, cases[tc].rules), action + ' is deferred');
    });
    actions.filter(undef).forEach(function undeferreds (action) {
      t.notOk(deferred(action, cases[tc].rules), action + ' is not deferred');
    });
    t.end();
  }

  function undef (action) {
    return cases[tc].deferred.indexOf(action) === -1;
  }
});

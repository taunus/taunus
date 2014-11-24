'use strict';

var fs = require('fs');
var test = require('tape');
var proxyquire = require('proxyquire');
var rc = require('../../lib/rc');
var cases = [
  'cli produces empty wiring module',
  'cli ignores unrouted actions',
  'cli lists routes',
  'cli lists routes and uses ignore parameter',
  'cli lists routes and uses cache parameters correctly',
  'cli finds controllers',
  'cli finds view templates',
  'cli defers actions and ignores deferred controllers or templates'
];

var oldrc = JSON.parse(JSON.stringify(rc));
var caseCount = 0;

cases.forEach(function register (tc, i) {
  test(tc, function testCase (t) {
    rc.server_routes = './test/lib/fixture/server_routes.' + i + '.js';
    rc.views = './test/lib/fixture/views_' + i;
    rc.client_controllers = './test/lib/fixture/controllers_' + i;
    var cli = require('../../lib/cli');
    var opt;
    if (i === 7) {
      opt = {
        deferred: ['bar/?']
      }
    }
    t.equal(cli.render(opt), read('./test/lib/fixture/wiring_expected.' + i + '.js'));
    t.end();
    okay();
  });
});

// apparently proxyquire cries in a corner if a module is required in many places
// this fugly hack works around that limitation.
function okay () {
  if (++caseCount === cases.length) {
    Object.keys(rc).forEach(function (key) {
      rc[key] = oldrc[key];
    });
  }
}

function read (file) {
  return fs.readFileSync(file, 'utf8');
}

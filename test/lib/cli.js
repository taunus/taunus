'use strict';

var fs = require('fs');
var test = require('tape');
var rc = require('../../lib/rc');

test('cli produces empty wiring module', function (t) {
  rc.server_routes = './test/lib/fixture/server_routes.js';
  var cli = require('../../lib/cli');
  t.equal(cli.render(), read('./test/lib/fixture/wiring.expected1.js'));
  t.end();
});

function read (file) {
  return fs.readFileSync(file, 'utf8');
}

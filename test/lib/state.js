'use strict';

var test = require('tape');

test('state is an event emitter', function (t) {
  var state = require('../../lib/state');
  t.ok(typeof state.emit === 'function', 'has an .emit method');
  t.ok(typeof state.once === 'function', 'has an .once method');
  t.ok(typeof state.off === 'function', 'has an .off method');
  t.ok(typeof state.on === 'function', 'has an .on method');
  t.end();
});

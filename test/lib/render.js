'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('render without layout gets some html anyways', function (t) {
  var state = {
    defaults: {},
    getPartial: function (action, vm, done) { done(null,'action:' + action + ',vm:' + JSON.stringify(vm)); }
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'text/html'
    },
    query: {}
  };
  var res = {
    set: sinon.spy(),
    send: sinon.spy()
  };
  function next () {}
  render({ action: 'foo/bar' }, vm, req, res, next);
  t.ok(res.send.calledOnce, 'called res.send');
  t.deepEqual(res.send.firstCall.args, ['<pre><code>{\n  "model": {},\n  "action": "foo/bar",\n  "taunus": {},\n  "partial": "action:foo/bar,vm:{\\"taunus\\":{}}"\n}</code></pre>'], 'got html response anyways');
  t.end();
});

test('render with layout gets some plain text', function (t) {
  var state = {
    defaults: {},
    getPartial: function (action, vm, done) { done(null,'<b>action</b>:' + action + ',<br/><b>vm</b>:' + JSON.stringify(vm)); },
    layout: function (data) { return '<p>' + data.partial + '</p>'; }
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'text/plain'
    },
    query: {}
  };
  var res = {
    set: sinon.spy(),
    send: sinon.spy()
  };
  function next () {}
  render({ action: 'foo/bar' }, vm, req, res, next);
  t.ok(res.send.calledOnce, 'called res.send');
  t.deepEqual(res.send.firstCall.args, ['action:foo/bar, vm:{"taunus":{}}'], 'got plaintext response');
  t.end();
});

test('setting model.action uses different action', function (t) {
  var state = {
    defaults: {},
    getPartial: function (action, vm, done) { done(null,'action:' + action + ',vm:' + JSON.stringify(vm)); }
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = {model:{action:'bar/baz'}};
  var req = {
    headers: {
      accept: 'text/html'
    },
    query: {}
  };
  var res = {
    set: sinon.spy(),
    send: sinon.spy()
  };
  function next () {}
  render({ action: 'foo/bar' }, vm, req, res, next);
  t.ok(res.send.calledOnce, 'called res.send');
  t.deepEqual(res.send.firstCall.args, ['<pre><code>{\n  "model": {\n    "action": "bar/baz"\n  },\n  "action": "bar/baz",\n  "taunus": {},\n  "partial": "action:bar/baz,vm:{\\"action\\":\\"bar/baz\\",\\"taunus\\":{}}"\n}</code></pre>'], 'got model\'s action');
  t.end();
});

test('render sets cache headers', function (t) {
  var state = {
    defaults: {},
    getPartial: function (action, vm, done) { done(null,'action:' + action + ',vm:' + JSON.stringify(vm)); }
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = {};
  var req = {
    url: '/foo',
    headers: {
      accept: 'text/html'
    },
    query: {}
  };
  var res = {
    set: sinon.spy(),
    send: sinon.spy()
  };
  function next () {}
  render({ action: 'foo/bar' }, vm, req, res, next);
  t.ok(res.set.calledWith('Vary', 'Accept'), 'vary accept header');
  t.ok(res.set.calledWith('ETag'), 'etag header');
  t.ok(res.set.calledWith('cache-control', 'private, must-revalidate, max-age=0'), 'cache control header');
  t.end();
});

test('render JSON just gets json', function (t) {
  var state = {
    defaults: {}, // set at mountpoint
    version: '1' // set at mountpoint
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {}
  };
  var res = {
    set: sinon.spy(),
    json: json
  };
  function next () {}
  render({ action: 'foo/bar' }, vm, req, res, next);
  function json (data) {
    t.deepEqual(data, { model: {}, version: '1' });
    t.end();
  }
});

test('flash and user are forwarded from model', function (t) {
  var state = {
    defaults: {}, // set at mountpoint
    version: '1' // set at mountpoint
  };
  var render = proxyquire('../../lib/render', {
    './state': state
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {},
    flash: function () { return { candy: 'cane' }; },
    user: { corsair: 'interstellar' }
  };
  var res = {
    set: sinon.spy(),
    json: json
  };
  function next () {}
  render({ action: 'foo/bar' }, vm, req, res, next);
  function json (data) {
    t.deepEqual(data, { model: { flash: { candy: 'cane' }, user: { corsair: 'interstellar' } }, version: '1' });
    t.end();
  }
});

test('render JSON demanding controller gets bundled controller', function (t) {
  var state = {
    defaults: {}, // set at mountpoint
    version: '1' // set at mountpoint
  };
  var render = proxyquire('../../lib/render', {
    './state': state,
    './bro': bro
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {
      controller: ''
    }
  };
  var res = {
    set: sinon.spy(),
    json: json
  };
  function next () {}
  function bro (file, compiled) {
    t.equal(file, 'client/js/controllers/foo/bar.js', 'asked for controller according to convention');
    t.ok(typeof compiled === 'function', 'got done callback');
    compiled(null, 'foo');
  }
  render({ action: 'foo/bar' }, vm, req, res, next);
  function json (data) {
    t.deepEqual(data, { controller: 'foo', model: {}, version: '1' });
    t.end();
  }
});

test('render JSON demanding template gets bundled template', function (t) {
  var state = {
    defaults: {}, // set at mountpoint
    version: '1' // set at mountpoint
  };
  var render = proxyquire('../../lib/render', {
    './state': state,
    './bro': bro
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {
      template: ''
    }
  };
  var res = {
    set: sinon.spy(),
    json: json
  };
  function next () {}
  function bro (file, compiled) {
    t.equal(file, '.bin/views/foo/bar.js', 'asked for view template according to convention');
    t.ok(typeof compiled === 'function', 'got done callback');
    compiled(null, 'foo');
  }
  render({ action: 'foo/bar' }, vm, req, res, next);
  function json (data) {
    t.deepEqual(data, { template: 'foo', model: {}, version: '1' });
    t.end();
  }
});

test('render JSON demanding things gets bundled components', function (t) {
  var state = {
    defaults: {}, // set at mountpoint
    version: '1' // set at mountpoint
  };
  var render = proxyquire('../../lib/render', {
    './state': state,
    './bro': bro
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {
      controller: '',
      template: ''
    }
  };
  var res = {
    set: sinon.spy(),
    json: json
  };
  function next () {}
  function bro (file, compiled) {
    var map = {
      '.bin/views/foo/bar.js': 'foo',
      'client/js/controllers/foo/bar.js': 'bar'
    };
    t.ok(map[file], 'asked for expected component according to convention');
    t.ok(typeof compiled === 'function', 'got done callback');
    compiled(null, map[file]);
  }
  render({ action: 'foo/bar' }, vm, req, res, next);
  function json (data) {
    t.deepEqual(data, { controller: 'bar', template: 'foo', model: {}, version: '1' });
    t.end();
  }
});

test('render JSON demanding things gets bundled components for different action when hijacked', function (t) {
  var state = {
    defaults: {}, // set at mountpoint
    version: '1' // set at mountpoint
  };
  var render = proxyquire('../../lib/render', {
    './state': state,
    './bro': bro
  });
  var vm = {};
  var req = {
    headers: {
      accept: 'application/json'
    },
    query: {
      hijacker: 'foo/mar',
      controller: '',
      template: ''
    }
  };
  var res = {
    set: sinon.spy(),
    json: json
  };
  function next () {}
  function bro (file, compiled) {
    var map = {
      '.bin/views/foo/bar.js': 'tar',
      'client/js/controllers/foo/bar.js': 'taint',
      '.bin/views/foo/mar.js': 'foo',
      'client/js/controllers/foo/mar.js': 'bar'
    };
    t.ok(map[file], 'asked for expected component according to convention');
    t.ok(typeof compiled === 'function', 'got done callback');
    compiled(null, map[file]);
  }
  render({ action: 'foo/bar' }, vm, req, res, next);
  function json (data) {
    t.deepEqual(data, { controller: 'bar', template: 'foo', version: '1' });
    t.end();
  }
});

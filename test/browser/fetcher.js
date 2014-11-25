'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

test('fetcher makes ajax call when not intercepted, and error emits event', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    deferrals: []
  };
  var emitter = {
    emit: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  var err = new Error('foo');
  fetcher(route, context, done);
  t.ok(interceptor.execute.calledWith(route));
  t.equal(typeof interceptor.execute.firstCall.args[1], 'function');
  interceptor.execute.firstCall.args[1](null, {});
  t.ok(emitter.emit.calledWith('fetch.start', route, context));
  t.ok(xhr.calledWith('/foo?json', sinon.match.typeOf('function')));
  xhr.firstCall.args[1](err);
  t.ok(emitter.emit.calledWith('fetch.error', route, context, err));
  t.ok(done.calledWith(err));
  t.end();
});

test('fetcher makes ajax call when not intercepted, and abortion emits event', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    deferrals: []
  };
  var emitter = {
    emit: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  var err = new Error('aborted');
  fetcher(route, context, done);
  t.ok(interceptor.execute.calledWith(route));
  t.equal(typeof interceptor.execute.firstCall.args[1], 'function');
  interceptor.execute.firstCall.args[1](null, {});
  t.ok(emitter.emit.calledWith('fetch.start', route, context));
  t.ok(xhr.calledWith('/foo?json', sinon.match.typeOf('function')));
  xhr.firstCall.args[1](err);
  t.ok(emitter.emit.calledWith('fetch.abort', route, context));
  t.ok(done.calledWith(err));
  t.end();
});

test('fetcher makes ajax call when not intercepted, and success emits event', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    deferrals: []
  };
  var emitter = {
    emit: sinon.spy()
  };
  var componentCache = {
    set: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  var data = {};
  fetcher(route, context, done);
  t.ok(interceptor.execute.calledWith(route));
  t.equal(typeof interceptor.execute.firstCall.args[1], 'function');
  interceptor.execute.firstCall.args[1](null, {});
  t.ok(emitter.emit.calledWith('fetch.start', route, context));
  t.ok(xhr.calledWith('/foo?json', sinon.match.typeOf('function')));
  xhr.firstCall.args[1](null, data, {});
  t.ok(emitter.emit.calledWith('fetch.done', route, context, data));
  t.ok(done.calledWith(null, data));
  t.end();
});

test('fetcher makes ajax call when not intercepted, and success with versioned data stores components', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    deferrals: [],
    version: '1'
  };
  var emitter = {
    emit: sinon.spy()
  };
  var componentCache = {
    set: sinon.spy()
  };
  var resRoute = {parts: {query: {}}};
  var router = sinon.stub().returns(resRoute);
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr,
    './router': router,
    './componentCache': componentCache
  });
  var data = {version:'31'};
  fetcher(route, context, done);
  t.ok(interceptor.execute.calledWith(route));
  t.equal(typeof interceptor.execute.firstCall.args[1], 'function');
  interceptor.execute.firstCall.args[1](null, {});
  t.ok(emitter.emit.calledWith('fetch.start', route, context));
  t.ok(xhr.calledWith('/foo?json', sinon.match.typeOf('function')));
  t.equal(state.version, '1');
  xhr.firstCall.args[1](null, data, {});
  t.equal(state.version, '31');
  t.ok(componentCache.set.calledWith('foo', data));
  t.ok(emitter.emit.calledWith('fetch.done', route, context, data));
  t.ok(done.calledWith(null, data));
  t.end();
});

test('fetcher gets intercepted', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    deferrals: []
  };
  var emitter = {
    emit: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  var data = {};
  fetcher(route, context, done);
  t.ok(interceptor.execute.calledWith(route));
  t.equal(typeof interceptor.execute.firstCall.args[1], 'function');
  interceptor.execute.firstCall.args[1](null, {
    defaultPrevented: true, data: data
  });
  t.ok(done.calledWith(null, data));
  t.end();
});

test('fetcher can be aborted', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    deferrals: []
  };
  var emitter = {
    emit: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  fetcher(route, context, done);
  interceptor.execute.firstCall.args[1](null, {});
  t.notOk(ajax.abort.calledOnce);
  fetcher.abortPending();
  t.ok(ajax.abort.calledOnce);
  t.end();
});

test('fetcher makes ajax call, and subsequent fetch aborts first one', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var routeB = {action:'bar',parts:{pathname:'/bar'}};
  var context = {source:'mock'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    deferrals: []
  };
  var emitter = {
    emit: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  var err = new Error('foo');
  fetcher(route, context, done);
  interceptor.execute.firstCall.args[1](null, {});
  xhr.firstCall.args[1](err);
  t.ok(ajax.abort.notCalled);
  fetcher(routeB, context, done);
  t.ok(ajax.abort.calledOnce);
  t.end();
});

test('hijacker builds ajax query string for components', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock',hijacker:'paul'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    templates: {},
    controllers: {},
    deferrals: ['?']
  };
  var emitter = {
    emit: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  fetcher(route, context, done);
  interceptor.execute.firstCall.args[1](null, {});
  t.equal(xhr.firstCall.args[0], '/foo?json&template&controller&hijacker=paul', 'url meets hijack expectation');
  t.end();
});

test('hijacker builds ajax query string for missing controller only', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock',hijacker:'paul'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    templates: {paul:{fn:function(){},version:'1'}},
    controllers: {},
    deferrals: ['?'],
    version:'1'
  };
  var emitter = {
    emit: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  fetcher(route, context, done);
  interceptor.execute.firstCall.args[1](null, {});
  t.equal(xhr.firstCall.args[0], '/foo?json&controller&hijacker=paul', 'url meets hijack expectation');
  t.end();
});

test('hijacker builds ajax query string for missing template only', function (t) {
  var interceptor = {
    execute: sinon.spy()
  };
  var done = sinon.spy();
  var route = {action:'foo',parts:{pathname:'/foo'}};
  var context = {source:'mock',hijacker:'paul'};
  var ajax = {abort:sinon.spy()};
  var xhr = sinon.stub().returns(ajax);
  var state = {
    templates: {},
    controllers: {paul:{fn:function(){},version:'1'}},
    deferrals: ['?'],
    version:'1'
  };
  var emitter = {
    emit: sinon.spy()
  };
  var fetcher = proxyquire('../../browser/fetcher', {
    './interceptor': interceptor,
    './emitter': emitter,
    './state': state,
    './xhr': xhr
  });
  fetcher(route, context, done);
  interceptor.execute.firstCall.args[1](null, {});
  t.equal(xhr.firstCall.args[0], '/foo?json&template&hijacker=paul', 'url meets hijack expectation');
  t.end();
});

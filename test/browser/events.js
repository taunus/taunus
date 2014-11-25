'use strict';

var test = require('tape');
var sinon = require('sinon');

test('events supports all the things', function (t) {
  var elem = {};
  var foo = sinon.spy();
  var events = require('../../browser/events');
  events.add(elem, 'click', foo);
  t.ok(elem.onclick);
  t.end();
});

test('events actually call back', function (t) {
  var elem = {};
  var foo = sinon.spy();
  var events = require('../../browser/events');
  events.add(elem, 'click', foo);
  elem.onclick();
  t.ok(foo.calledOnce);
  t.end();
});

test('events supports attachEvent', function (t) {
  var elem = {attachEvent:sinon.spy()};
  var foo = sinon.spy();
  var events = require('../../browser/events');
  events.add(elem, 'click', foo);
  t.ok(elem.attachEvent.calledWith('onclick'));
  elem.attachEvent.firstCall.args[1]({});
  t.ok(foo.calledOnce);
  t.end();
});

test('events actually call back', function (t) {
  var elem = {addEventListener:sinon.spy()};
  var foo = sinon.spy();
  var events = require('../../browser/events');
  events.add(elem, 'click', foo);
  t.ok(elem.addEventListener.calledWith('click', foo));
  t.end();
});

'use strict';

var document = require('./global/document');
var emitter = require('./emitter');
var body = document.body;
var tracker = [];

function enable () {
  emitter.on('render', collect);
}

function track (el, destroyable, options) {
  var o = options || {};
  if (o.implodes !== true) { o.implodes = false; }
  tracker.push({ el: el, destroyable: destroyable, options: o });
}

function collect (container) {
  tracker.filter(removables).forEach(remove);
  tracker = tracker.filter(not(removables));
  function removables (context) {
    if (context.el === container && context.options.implodes) {
      return true; // not typically what we want. may unbind events and never rebind
    }
    if (body.contains(context.el) === false) {
      return true;
    }
  }
}

function not (fn) {
  return function negated () {
    return !fn.apply(this, arguments);
  };
}

function remove (context) {
  context.destroyable.destroy();
}

module.exports = {
  enable: enable,
  track: track,
  collect: collect
};

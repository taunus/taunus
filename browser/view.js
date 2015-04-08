'use strict';

var clone = require('./clone');
var state = require('./state');
var ee = require('contra.emitter');
var emitter = require('./emitter');
var fetcher = require('./fetcher');
var deferral = require('./deferral');
var templatingAPI = require('./templatingAPI');

function noop () {}

function view (container, enforcedAction, model, route, options) {
  var action = enforcedAction || model && model.action || route && route.action;
  var demands = deferral.needs(action);
  var api = ee();

  global.DEBUG && global.DEBUG('[view] rendering view %s with [%s] demands', action, demands.join(','));

  if (demands.length) {
    pull();
  } else {
    ready();
  }

  return api;

  function pull () {
    var victim = route || state.route;
    var context = {
      source: 'hijacking',
      hijacker: action,
      element: container
    };
    global.DEBUG && global.DEBUG('[view] hijacking %s for action %s', victim.url, action);
    fetcher(victim, context, ready);
  }

  function ready () {
    var html;
    var controller = getComponent('controllers', action);
    var internals = options || {};
    if (internals.render !== false) {
      html = container.innerHTML = render(action, model, route);
      setTimeout(done, 0);
    } else {
      global.DEBUG && global.DEBUG('[view] not rendering %s', action);
    }
    if (container === state.container) {
      emitter.emit('change', route, model);
    }
    emitter.emit('render', container, model, route || null);
    global.DEBUG && global.DEBUG('[view] %s client-side controller for %s', controller ? 'executing' : 'no', action);
    if (typeof controller === 'function') {
      controller(model, container, route || null);
    }

    function done () {
      api.emit('render', html);
    }
  }
}

function render (action, model, route) {
  global.DEBUG && global.DEBUG('[view] rendering %s with model', action, model);
  var template = getComponent('templates', action);
  if (typeof template !== 'function') {
    throw new Error('Client-side "' + action + '" template not found');
  }
  var cloned = clone(model);
  cloned.taunus = templatingAPI;
  if (route) {
    cloned.route = route;
    cloned.route.toJSON = noop;
  } else {
    cloned.route = null;
  }
  try {
    return template(cloned);
  } catch (e) {
    throw new Error('Error rendering "' + action + '" view template\n' + e.stack);
  }
}

function getComponent (type, action) {
  var component = state[type][action];
  var transport = typeof component;
  if (transport === 'function') {
    return component;
  }
  if (component && component[state.version]) {
    return component[state.version].fn; // deferreds are stored as {v1:{fn},v2:{fn}}
  }
  return null;
}

function partial (container, action, model) {
  global.DEBUG && global.DEBUG('[view] rendering partial %s', action);
  return view(container, action, model, null, { partial: true });
}

view.partial = partial;

module.exports = view;

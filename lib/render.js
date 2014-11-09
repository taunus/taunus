'use strict';

var _ = require('lodash');
var path = require('path');
var util = require('util');
var crypto = require('crypto');
var hget = require('hget');
var accepts = require('./accepts');
var resolvers = require('./resolvers');
var optionalRequire = require('./optionalRequire');
var state = require('./state');
var rc = require('./rc');

function md5 (value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

function render (defaultAction, vm, req, res, next) {
  var data = _.merge({}, state.defaults, vm);
  var accept = accepts(req);

  if (data.skip || !accept) {
    next(); return;
  }

  data.requestUrl = req.url + '?json';
  data.model = data.model || {};
  var action = data.model.action || defaultAction;
  var strategy;

  if (req.flash) {
    data.model.flash = req.flash();
  }

  if (req.user) {
    data.model.user = req.user;
  }

  if (data.statusCode) {
    res.status(data.statusCode);
    delete data.statusCode;
  }

  headers();

  if (accept === 'json' || 'json' in req.query) {
    strategy = 'callback' in req.query ? 'jsonp' : 'json';
    res[strategy](data.model);
  } else if (accept === 'html') {
    html(res.send.bind(res));
  } else if (accept === 'text') {
    html(toText);
  }

  function headers () {
    var etag = md5(JSON.stringify(data.model));
    res.set('Vary', 'Accept');
    res.set('ETag', etag);
    res.set('cache-control', 'private, must-revalidate, max-age=0');
  }

  function html (done) {
    var location = resolvers.getViewTemplatePath(action);
    var relative = path.relative(__dirname, location);
    var template = optionalRequire(location);
    if (template === null) {
      console.warn('Missing view template for "%s" action. Searched location: "%s"', action, location);
      data.partial = '';
    } else {
      data.partial = template(data.model);
    }

    try {
      if (typeof rc.layout === 'function') {
        done(rc.layout(data));
      } else {
        console.warn('Missing Taunus view layout. Should be assigned as a method on `options`: taunus.mount(addRoute, { layout })');
        done(util.format('<pre><code>%s</code></pre>', JSON.stringify(data, null, 2)));
      }
    } catch (err) {
      next(err);
    }
  }

  function toText (html) {
    res.send(hget(html, state.hget));
  }
}

function defer () {
  var args = Array.prototype.slice.call(arguments);
  if (state.defaults) {
    deferred();
  } else {
    state.once('defaults', deferred);
  }
  function deferred () {
    render.apply(null, args);
  }
}

module.exports = defer;

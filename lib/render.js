'use strict';

var _ = require('lodash');
var path = require('path');
var util = require('util');
var hget = require('hget');
var crypto = require('crypto');
var contra = require('contra');
var bro = require('./bro');
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
  data.version = state.version;

  var action = data.model.action || defaultAction;

  if (req.flash) {
    data.model.flash = req.flash();
  }

  if (req.user) {
    data.model.user = req.user;
  }

  headers();

  if (accept === 'json' || 'json' in req.query) {
    jsonx();
  } else if (accept === 'html') {
    html(res.send.bind(res));
  } else if (accept === 'text') {
    html(toText);
  }

  function headers () {
    var etag = md5(req.url + JSON.stringify(data));
    res.set('Vary', 'Accept');
    res.set('ETag', etag);
    res.set('cache-control', 'private, must-revalidate, max-age=0');
  }

  function jsonx () {
    var strategy = 'callback' in req.query ? 'jsonp' : 'json';
    var hijacked = 'hijacker' in req.query;
    var response = {
        version: data.version
      };

    if (hijacked === false) {
      response.model = data.model;
    }

    if (action !== defaultAction && !hijacked) {
      respond(); // only add view/controller for the default action, or hijackers
    } else {
      contra.concurrent([
        add('template', 'views'),
        add('controller', 'client_controllers')
      ], respond);
    }

    function add (demand, base) {
      return function addModule (done) {
        var needsModule = demand in req.query;
        if (needsModule === false) {
          done(); return;
        }
        var a = req.query.hijacker || action;
        var file = path.join(rc[base], a + '.js');
        bro(file, include);

        function include (err, data) {
          if (!err) {
            response[demand] = data;
          }
          done(err);
        }
      };
    }

    function respond (err) {
      if (err) {
        next(err); return;
      }
      res[strategy](response);
    }
  }

  function getPartial (action, model, done) {
    var location = resolvers.getView(action);
    var relative = path.relative(__dirname, location);
    var template = optionalRequire(location);
    if (template === null) {
      console.warn('Missing view template for "%s" action. Searched location: "%s"', action, location);
      done(null, '');
    } else {
      try {
        done(null, template(model));
      } catch (e) {
        done(e);
      }
    }
  }

  function html (done) {
    (state.getPartial || getPartial)(action, data.model, gotPartial);

    function gotPartial (err, partial) {
      if (err) {
        next(err); return;
      }
      data.partial = partial;

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
  }

  function toText (html) {
    res.send(hget(html, state.plaintext));
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

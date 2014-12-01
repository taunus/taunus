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
var templatingAPI = require('./templatingAPI');
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

  data.model = data.model || {};
  var action = data.model.action || defaultAction;

  data.action = action;
  data.version = state.version;

  if (req.flash) {
    data.model.flash = req.flash();
  }

  if (req.user) {
    data.model.user = req.user;
  }

  if (accept === 'json' || 'json' in req.query) {
    jsonx();
  } else if (accept === 'html') {
    html(transmit);
  } else if (accept === 'text') {
    html(toText);
  }

  function headers (data) {
    var etag = md5(req.url + data);
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
      headers(JSON.stringify(response));
      res[strategy](response);
    }
  }

  function getPartial (action, model, done) {
    var location = resolvers.getView(action);
    var relative = path.relative(__dirname, location);
    var template = optionalRequire(location, module);
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
    data.taunus = templatingAPI;
    data.model.taunus = templatingAPI;
    (state.getPartial || getPartial)(action, data.model, gotPartial);

    function gotPartial (err, partial) {
      if (err) {
        next(err); return;
      }
      data.partial = partial;

      try {
        if (typeof state.layout === 'function') {
          done(state.layout(data));
        } else {
          console.warn('Missing view layout. Should be assigned as a method on `options`: taunus.mount(addRoute, { layout })');
          done(util.format('<pre><code>%s</code></pre>', JSON.stringify(data, null, 2)));
        }
      } catch (err) {
        next(err);
      }
    }
  }

  function transmit (response) {
    headers(response);
    res.send(response);
  }

  function toText (html) {
    transmit(hget(html, state.plaintext));
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

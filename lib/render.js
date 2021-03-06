'use strict';

var _ = require('lodash');
var url = require('url');
var path = require('path');
var util = require('util');
var hget = require('hget');
var crypto = require('crypto');
var contra = require('contra');
var safeson = require('safeson');
var bro = require('./bro');
var accepts = require('./accepts');
var resolvers = require('./resolvers');
var queryparser = require('./queryparser');
var optionalRequire = require('./optionalRequire');
var state = require('./state');
var templatingAPI = require('./templatingAPI');
var rc = require('./rc');

function noop () {}

function md5 (value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

function cloneParams (params) {
  return Object.keys(params).reduce(cloner, { args: [] });

  function cloner (result, key) {
    var value = queryparser.field(params[key]);
    var numeric = /^\d+$/;
    if (numeric.test(key)) {
      result.args.push(value);
    } else {
      result[key] = value;
    }
    return result;
  }
}

function render (route, vm, req, res, next) {
  var baked = _.merge({ model: {} }, state.defaults, vm, { version: state.version });

  if (!('redirect' in baked)) {
    if (req.flash) {
      baked.model.flash = req.flash();
    }
    if (req.user) {
      baked.model.user = req.user;
    }
  }

  if (state.beforeRender) {
    state.beforeRender(baked, { route: route, req: req, res: res }, gotData);
  } else {
    gotData(null, baked);
  }

  function gotData (err, data) {
    if (err) {
      next(err); return;
    }
    var accept = accepts(req);
    var action = data.model.action || route.action;
    var params = cloneParams(req.params);

    data.action = action;

    if (data.skip) {
      next(); return;
    }

    if ('redirect' in data) {
      if (accept === 'json' || 'json' in req.query) {
        end('json', { version: state.version, redirect: data.redirect });
      } else if (accept === 'html') {
        res.redirect(data.redirect.href);
      }
      return;
    }

    if (accept === 'json' || 'json' in req.query) {
      jsonx();
    } else if (accept === 'html') {
      html(transmit);
    } else {
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

      if (action !== route.action && !hijacked) {
        respond(); // only add view/controller for the default route action or hijackers
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
        end(strategy, response);
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
      var search = url.parse(req.url).search;
      var cloned = _.cloneDeep(data.model);

      augment(data);
      augment(cloned);

      function augment (host) {
        host.taunus = templatingAPI;
        host.route = {
          action: action,
          route: route.route,
          params: params,
          url: req.url,
          path: req.url,
          pathname: req.path,
          query: queryparser(req.query),
          search: search,
          hash: '',
          toJSON: noop
        };
      }

      (state.getPartial || getPartial)(action, cloned, gotPartial);

      function gotPartial (err, partial) {
        if (err) {
          next(err); return;
        }
        data.partial = partial;

        try {
          if (typeof state.layout === 'function') {
            done(state.layout(data));
          } else {
            console.warn('Missing view layout. Should be assigned as a method on `options`:\ntaunus.mount(addRoute, { layout })');
            done(util.format('<pre><code>%s</code></pre>', JSON.stringify(data, null, 2)));
          }
        } catch (err) {
          next(err);
        }
      }
    }

    function end (strategy, data) {
      headers(JSON.stringify(data));

      if (strategy === 'json' && 'as-text' in req.query) {
        res.set('Content-Type', 'text/html');
        res.send(safeson(data, process.env.NODE_ENV === 'development' ? 2 : 0));
      } else {
        res[strategy](data);
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

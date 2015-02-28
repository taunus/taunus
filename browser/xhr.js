'use strict';

var xhr = require('xhr');

function request (url, options, done) {
  var o = {
    url: url,
    headers: { Accept: 'application/json' }
  };
  if (done) {
    Object.keys(options).forEach(overwrite);
  } else {
    done = options;
  }

  global.DEBUG && global.DEBUG('[xhr] %s %s', o.method || 'GET', o.url);

  var req = xhr(o, handle);

  return req;

  function overwrite (prop) {
    o[prop] = options[prop];
  }

  function handle (err, res, body) {
    if (err && !req.getAllResponseHeaders()) {
      global.DEBUG && global.DEBUG('[xhr] %s %s aborted', o.method || 'GET', o.url);
      done(new Error('aborted'), null, res);
    } else {
      try  {
        res.body = body = JSON.parse(body);
      } catch (e) {
        // suppress
      }
      global.DEBUG && global.DEBUG('[xhr] %s %s done', o.method || 'GET', o.url);
      done(err, body, res);
    }
  }
}

module.exports = request;

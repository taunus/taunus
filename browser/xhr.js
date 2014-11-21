'use strict';

var xhr = require('xhr');

function request (url, o, done) {
  var options = {
    url: url,
    json: true,
    headers: { Accept: 'application/json' }
  };
  if (done) {
    Object.keys(o).forEach(overwrite);
  } else {
    done = o;
  }

  global.DEBUG && global.DEBUG('[xhr] %s %s', options.method || 'GET', options.url);

  var req = xhr(options, handle);

  return req;

  function overwrite (prop) {
    options[prop] = o[prop];
  }

  function handle (err, res, body) {
    if (err && !req.getAllResponseHeaders()) {
      global.DEBUG && global.DEBUG('[xhr] %s %s aborted', options.method || 'GET', options.url);
      done(new Error('aborted'), null, res);
    } else {
      global.DEBUG && global.DEBUG('[xhr] %s %s done', options.method || 'GET', options.url);
      done(err, body, res);
    }
  }
}

module.exports = request;

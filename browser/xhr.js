'use strict';

var xhr = require('xhr');
var sum = require('hash-sum');
var temporize = require('temporize');

function request (url, options, end) {
  var displaced = typeof options === 'function';
  var hasUrl = typeof url === 'string';
  var user;
  var done = displaced ? options : end;

  if (hasUrl) {
    if (displaced) {
      user = { url: url };
    } else {
      user = options;
      user.url = url;
    }
  } else {
    user = url;
  }

  var o = {
    headers: { Accept: 'application/json' }
  };
  Object.keys(user).forEach(overwrite);

  var req;
  var hash = sum(o) + ':' + o.url;
  var cached = true;

  temporize({
    name: hash,
    seconds: 1,
    load: load
  }, loaded);

  return req;

  function overwrite (prop) {
    o[prop] = user[prop];
  }

  function load (done) {
    global.DEBUG && global.DEBUG('[xhr] %s %s', o.method || 'GET', o.url);
    cached = false;
    var result = xhr(o, handle);
    done(null, result);
    return result;
  }

  function loaded (result) {
    if (cached) {
      global.DEBUG && global.DEBUG('[xhr] %s %s (cache)', o.method || 'GET', o.url);
    }
    req = result;
  }

  function handle (err, res, body) {
    if (err && !req.getAllResponseHeaders()) {
      global.DEBUG && global.DEBUG('[xhr] %s %s (aborted)', o.method || 'GET', o.url);
      done(new Error('aborted'), null, res);
    } else {
      try  {
        res.body = body = JSON.parse(body);
      } catch (e) {
        // suppress
      }
      global.DEBUG && global.DEBUG('[xhr] %s %s (done)', o.method || 'GET', o.url);
      done(err, body, res);
    }
  }
}

module.exports = request;

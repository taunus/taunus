'use strict';

var xhr = require('xhr');
var emitter = require('./emitter');

module.exports = function (url, done) {
  var options = {
    url: url,
    json: true,
    headers: { Accept: 'application/json' }
  };
  return xhr(options, handle);

  function handle (err, res, body) {
    done(err, body);
  }
};

'use strict';

var xhr = require('xhr');
var emitter = require('./emitter');

module.exports = function (url, context, done) {
  var options = {
    url: url,
    json: true,
    headers: { Accept: 'application/json' }
  };
  return xhr(options, handle);

  function handle (err, res, body) {
    if (err) {
      emitter.emit('error', err, { source: 'xhr', context: context }, res);
    } else {
      done(body);
    }
  }
};

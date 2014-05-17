'use strict';

var xhr = require('xhr');

// TODO thin-like emitter so that you can validate and stop propagation / default handler
// TODO ability to return a model on the spot through emitter, as well
module.exports = function (url, done) {
  var options = {
    url: url,
    json: true,
    headers: { Accept: 'application/json' }
  };
  xhr(options, handle);

  function handle (err, res, body) {
    if (err) {
      return; // TODO handle response errors ???
    }
    done(body);
  }
};

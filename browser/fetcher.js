'use strict';

var superagent = require('superagent');

// TODO thin-like layer validation
// TODO thin-like abortions
// TODO ability to return a model on the spot
module.exports = function (url, done) {
  superagent
    .get(url)
    .set('Accept', 'application/json')
    .end(handle);

  function handle (err, res) {
    if (err) {
      return; // TODO handle response errors ???
    }
    done(res);
  }
};

'use strict';

var superagent = require('superagent');

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

'use strict';

var fetcher = require('./fetcher');
var Matcher = require('routes');
var matcher = Matcher();

function router (url) {
  return matcher.match(url).fn();
}

function setup (definitions) {
  definitions.forEach(define);
}

function define (d) {
  matcher.addRoute(d.route, function () {
    return d;
  });
}

router.setup = setup;

module.exports = router;

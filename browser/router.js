'use strict';

var routes = require('routes');
var matcher = routes();

function router (url) {
  var match = matcher.match(url);
  return match ? match.fn() : null;
}

function setup (definitions) {
  definitions.forEach(define);
}

function define (d) {
  matcher.addRoute(d.route, function definition () {
    return d;
  });
}

router.setup = setup;

module.exports = router;

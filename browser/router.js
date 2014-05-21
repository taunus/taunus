'use strict';

var routes = require('routes');
var matcher = routes();

function router (url) {
  var match = matcher.match(url);
  return match ? match.fn(match) : null;
}

function setup (definitions) {
  definitions.forEach(define);
}

function define (d) {
  matcher.addRoute(d.route, function definition (match) {
    d.params = match.params;
    d.params.args = match.splats;
    return d;
  });
}

router.setup = setup;

module.exports = router;

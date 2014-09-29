'use strict';

var routes = require('routes');
var matcher = routes();

function router (url) {
  var match = matcher.match(url);
  return match ? match.fn(match) : null;
}

function setup (definitions) {
  Object.keys(definitions).forEach(define.bind(null, definitions));
}

function define (definitions, key) {
  matcher.addRoute(key, function definition (match) {
    var params = match.params;
    params.args = match.splats;
    return {
      route: key,
      params: params,
      action: definitions[key].action || null,
      ignore: definitions[key].ignore
    };
  });
}

router.setup = setup;

module.exports = router;

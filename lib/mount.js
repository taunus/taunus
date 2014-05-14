'use strict';

var path = require('path');
var render = require('./render');
var cwd = process.cwd();

module.exports = function (app, routes) {
  routes.forEach(register);
  app.get('/*', render);

  function register (route) {
    var middleware = [route.route, augment].concat(route.middleware || []);
    var ca = route.action.split('/');
    var ctrl = require(path.join(cwd, controllers, ca[0]);
    var action = ca[1];
    var fn = require(ctrl)[action];

    middleware.push(fn);
    app.get.apply(app, middleware);

    function augment (req, res, next) {
      res.partial = route.action;
      next();
    }
  }
};

/*module.exports = [{
  route: '/',
  template: require('../../.bin/views/home/index'),
  controller: require('./controllers/home/index')
}, {
  route: '/author/compose',
  template: require('../../.bin/views/author/compose'),
  controller: require('./controllers/author/compose')
},];
*/
